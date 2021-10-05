import * as React from 'react';
import "./Css/Folder.css"
import { IFolder } from '../helpers/Interfaces';


export interface FolderProps {
  folder: IFolder;
}

export function Folder({ folder }: FolderProps) {
  const { id, name, numSets, userId } = folder
  return (
    <div className="folder_container">
      <div className="folder_title">
        {name}
      </div>
      <div className="folder_numSets">
        <h1>Sets: {numSets}</h1>
      </div>
    </div>
  );
}
