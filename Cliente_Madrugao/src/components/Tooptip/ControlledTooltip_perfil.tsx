import React, { useEffect } from 'react';
import { Tooltip, TooltipProps } from '@rneui/themed';
import { connect } from 'react-redux';
import { setUser_tutorial, setUser_tutorial_inicial } from '../../store/action/user';


const ControlledTooltip_perfil: React.FC<any> = (props) => {
  const [open, setOpen] = React.useState(false);
  //atualizar open do tooltip
  useEffect(() => {
    setOpen(props.open);
    // console.log(open)
  }, [props.open]); 
   
  //atualizar o tutorial	
  const [updatedTutorials, setUpdatedTutorials] = React.useState(props.tutorials);
  useEffect(() => {
    const updatedTutorials = props.tutorials?.map((tutorial:any) => {
      if (tutorial.value === 'perfil') {
        return { ...tutorial, status: true };
      }
      return tutorial;
    });
    setUpdatedTutorials(updatedTutorials);
    // console.log('a',updatedTutorials)
  }, [props.tutorials]);
  return (
    <Tooltip
      visible={open}
      onOpen={() => {
      }}
      onClose={async() => {
        await props.onTutorial(updatedTutorials, props.id_user);
        setOpen(false);
      }}
      {...props}
    />
  );
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onTutorial_inicial : (id_user:string) => dispatch(setUser_tutorial_inicial(id_user)),
    onTutorial : (tutorials:any[], id_user: string) => dispatch(setUser_tutorial(tutorials,id_user)),

  };
};
export default connect(null,mapDispatchProps)(ControlledTooltip_perfil);