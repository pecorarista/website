import { deleteSync } from 'del';
import { dest } from './config.mjs';

export const clean = (done) => {
  deleteSync([ dest.root ]);
  done();
};
