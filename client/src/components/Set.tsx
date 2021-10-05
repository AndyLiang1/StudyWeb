import * as React from 'react';
import "./Css/Set.css"
import { ISet } from '../helpers/Interfaces';


export interface SetProps {
  set: ISet;
}

export function Set({ set }: SetProps) {
  const { id, name, numCards, folderId, userId } = set
  return (
    <div className="set_container">
      <div className="set_title">
        {name}
      </div>
      <div className="set_numSets">
        <h1>Cards: {numCards}</h1>
      </div>
    </div>
  );
}
