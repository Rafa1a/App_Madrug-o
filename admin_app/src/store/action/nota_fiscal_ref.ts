import { db } from '../auth';
import {  collection, getDocs } from 'firebase/firestore';
import { setMessage } from './message';

// funcao get para pegar as notas fiscais do banco de dados
