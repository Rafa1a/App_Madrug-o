import React, { useEffect } from 'react';
import { Tooltip, TooltipProps } from '@rneui/themed';
import { setUser_tutorial } from '../../store/action/user';
import { connect } from 'react-redux';


const ControlledTooltip_qrcode: React.FC<any> = (props) => {
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    setOpen(props.open);
    // console.log(open)
    }, [props.open]);
  //atualizar o tutorial
  const [updatedTutorials, setUpdatedTutorials] = React.useState(props.tutorials);
  useEffect(() => {
    const updatedTutorials = props.tutorials?.map((tutorial:any) => {
      if (tutorial.value === 'qrcode') {
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
    onTutorial : (tutorials:any[], id_user: string) => dispatch(setUser_tutorial(tutorials,id_user)),
  };
};
export default connect(null, mapDispatchProps)(ControlledTooltip_qrcode);