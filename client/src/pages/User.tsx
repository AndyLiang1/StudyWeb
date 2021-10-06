import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { NavigationBar } from "../components/Navbar"
import { AddPopUp } from "../components/CRUD/AddPopUp"
import { AuthContext, TimerContext } from '../helpers/Contexts';
import { IFolder, ISet } from "../helpers/Interfaces"
import { Folder } from "../components/Folder"
import { Set } from "../components/Set"
import folderImg from "../img/greyfolder.png"
import flashcardImg from "../img/flashcards.png"
import timerImg from "../img/timer.png"
import { IoIosTimer } from "react-icons/io"
import { IoRefreshOutline } from "react-icons/io5"

import "./Css/User.css"
import { AppContextInterface } from '../helpers/Interfaces';
import { useHistory } from 'react-router-dom';
import { RiStackFill } from 'react-icons/ri';
import { AiOutlineCloseCircle, AiOutlineFolder, AiOutlinePauseCircle, AiOutlinePlayCircle } from 'react-icons/ai';
import { clear, time } from 'console';
import { TimerPopUp } from '../components/Timer';
import { CustomTimerPopUp } from '../components/CRUD/CustomTimerPopUp';

export interface IAppProps {
}

export function User(props: IAppProps) {
  const { authState, setAuthState } = useContext(AuthContext);
  const { timerStatus, setTimerStatus, timeString, pause, reset, } = useContext(TimerContext)
  const [timerPopUpOpen, setTimerPopUpOpen] = useState<boolean>(false)
  const [folders, setFolders] = useState<IFolder[]>([])
  const [sets, setSets] = useState<ISet[]>([])
  const [addFolderPopUpOpen, setAddFolderPopUpOpen] = useState<boolean>(false)
  const [addSetPopUpOpen, setAddSetPopUpOpen] = useState<boolean>(false)
  let history = useHistory()

  const getFolderList = async () => {
    console.log('getting folders');
    fetch(`https://studyweb-backend.herokuapp.com/api/v1/folders/${authState.id}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken")!,
      },
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        console.log(responseJSON.foldersList);
        setFolders(responseJSON.foldersList)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const getSetList = async () => {
    console.log('getting sets');

    fetch(`https://studyweb-backend.herokuapp.com/api/v1/sets/all/${authState.id}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken")!,
      },
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        console.log('sets list', responseJSON.foldersList)
        setSets(responseJSON.setsList)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const openAddFolderPopUp = () => {
    setAddFolderPopUpOpen(true)
    if (addSetPopUpOpen || timerPopUpOpen) {
      setAddSetPopUpOpen(false)
      setTimerPopUpOpen(false)
    }
  }

  const openAddSetPopUp = () => {
    console.log('Opening set.', addSetPopUpOpen);
    setAddSetPopUpOpen(true)
    if (addFolderPopUpOpen || timerPopUpOpen) {
      setAddFolderPopUpOpen(false)
      setTimerPopUpOpen(false)
    }
  }

  const openTimerPopUp = () => {
    console.log('Opening timer.', timerPopUpOpen);
    setTimerPopUpOpen(true)
    if (addFolderPopUpOpen || addSetPopUpOpen) {
      setAddFolderPopUpOpen(false)
      setAddSetPopUpOpen(false)
    }
  }

  useEffect(() => {
    setAuthState(
      {
        name: localStorage.getItem("name")!,
        id: parseInt(localStorage.getItem("id")!),
        loggedIn: true
      }
    )
    localStorage.removeItem("folderIdFromURL")
    localStorage.removeItem("numFolders")
    localStorage.removeItem("folderName")
    localStorage.removeItem("setId")
    localStorage.removeItem("setName")
  }, [])

  const goToSetsPage = async (event: React.MouseEvent<HTMLElement>) => {
    const folderId: number = parseInt(event.currentTarget.getAttribute("data-folderid")!)
    const folderName: string = event.currentTarget.getAttribute("data-foldername")!
    history.push({
      pathname: "/listOneFolder",
      state: {
        folderIdFromURL: folderId,
        numFolders: folders.length,
        folderName,
      }
    })
  }

  const goToCardsPage = ((event: React.MouseEvent<HTMLElement>) => {
    const setId: number = parseInt(event.currentTarget.getAttribute("data-setid")!)
    const setName: string = event.currentTarget.getAttribute("data-setname")!
    history.push({
      pathname: "/listCards",
      state: {
        setId,
        setName,
        numFolders: folders.length,
        numSets: sets.length,
      }
    })
  })

  // =============================================================================
  // Timer
  // =============================================================================

  useEffect(() => {
    getFolderList()
    getSetList()
  }, [authState])






  return (
    <div className="user_container">
      {addFolderPopUpOpen ? (
        <div className="add_folder_pop_up">
          <AddPopUp
            setAddPopUpOpen={setAddFolderPopUpOpen}
            itemToAdd="folder"
            getFolderOrSetOrCardList={getFolderList}
          ></AddPopUp>
        </div>
      ) : null}
      {addSetPopUpOpen ? (
        <div className="add_set_pop_up">
          <AddPopUp
            setAddPopUpOpen={setAddSetPopUpOpen}
            itemToAdd="set"
            getFolderOrSetOrCardList={() => {
              getSetList()
              getFolderList()
            }}
            addingLoneSet={true}
            listFolders={folders}
          ></AddPopUp>
        </div>
      ) : null}
      {timerPopUpOpen ? (
        // <div className="timer_pop_up">
        //   <h1>Time remaining: {timeString}</h1>
        //   <button onClick={setTimer}> Start </button>
        // </div>
        <div className="timer_pop_up">
          <TimerPopUp
            setTimerPopUpOpen={setTimerPopUpOpen}
          ></TimerPopUp>
        </div>

      ) : null}

      <NavigationBar loggedIn={authState.loggedIn}></NavigationBar>

      <div className="user_content_container">
        <div className="create_container">
          <div className="create_folder">
            <h1 onClick={openAddFolderPopUp} className="plus_btn">+</h1>
            <AiOutlineFolder onClick={openAddFolderPopUp} className="icons"></AiOutlineFolder>
          </div>

          <div className="create_set">
            <h1 onClick={openAddSetPopUp} className="plus_btn">+</h1>
            <RiStackFill onClick={openAddSetPopUp} className="icons"></RiStackFill>
          </div>

          <div onClick={openTimerPopUp} className="timer">
            <h1 onClick={openTimerPopUp} className="plus_btn">+</h1>
            <IoIosTimer onClick={openTimerPopUp} className="icons"></IoIosTimer>
          </div>
        </div>

        {timerStatus === 'study' || timerStatus === 'break'
          || timerStatus === 'studyPause' || timerStatus === 'breakPause' ? (
            <div className="time_remaining_container">
              {timerStatus === 'study' || timerStatus === 'studyPause' ? (
                <div className="time_remaining_text">Study time remaining: {timeString}</div>
              ) : null}
              {timerStatus === 'break' || timerStatus === 'breakPause' ? (
                <div className="time_remaining_text">Break time remaining: {timeString}</div>
              ) : null}

              {!(timerStatus === 'studyPause' || timerStatus === 'breakPause') ? (
                <AiOutlinePauseCircle onClick={() => pause()} className="user_pauseplay_refresh_close_btn"></AiOutlinePauseCircle>
              ) : (
                  <AiOutlinePlayCircle onClick={() => pause()} className="user_pauseplay_refresh_close_btn"></AiOutlinePlayCircle>
                )}
              <IoRefreshOutline onClick={() => reset()} className="user_pauseplay_refresh_close_btn"></IoRefreshOutline>
              <AiOutlineCloseCircle className="user_pauseplay_refresh_close_btn" onClick={() => { setTimerStatus("killed") }}></AiOutlineCloseCircle>
            </div>
          ) : null}
        {/* {
          multOptionErr ? (
            <div className="timer_option_err">Already have a timer, please stop this timer first!</div>
          ) : null
        } */}
        <div className="folders_container">
          <div className="folders_title_viewAll">
            <h1 className="folders_container_title">Your folders</h1>
            <a className="viewAll" onClick={() => { history.push("./listFolders") }}>View All &gt; </a>
          </div>

          <div className="user_list_of_folders">
            {folders.slice(0, 10).map((oneFolder) => {
              return (
                <div className="user_one_item"
                  key={oneFolder.id}
                  onClick={goToSetsPage}
                  data-folderid={oneFolder.id}
                  data-foldername={oneFolder.name}>
                  <div
                    className="user_one_item_title_container"
                  >
                    <div className="user_one_item_folderImg_container">
                      <AiOutlineFolder className="user_one_item_folderIcon"></AiOutlineFolder>
                    </div>
                    <div className="user_one_item_name" >{oneFolder.name}</div>

                  </div>

                  <div className="user_one_item_numChild">Sets: {oneFolder.numSets}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="sets_container">
          <div className="sets_title_viewAll">
            <h1 className="sets_container_title">Your sets</h1>
            <a className="viewAll" onClick={() => { history.push("./listSets") }}>View All &gt; </a>
          </div>
          <div className="user_list_of_sets">
            {sets.slice(0, 10).map((oneSet) => {
              return (
                <div
                  className="user_one_item"
                  key={oneSet.id}
                  onClick={goToCardsPage}
                  data-setid={oneSet.id}
                  data-setname={oneSet.name}
                >
                  <div className="user_one_item_title_container">
                    <div className="user_one_item_folderImg_container">
                      <RiStackFill className="user_one_item_folderIcon"></RiStackFill>
                    </div>
                    <div className="user_one_item_name">{oneSet.name}</div>
                  </div>
                  <div className="user_one_item_numChild">Cards: {oneSet.numCards}</div>
                </div>
              )
            })}
          </div>

        </div>
      </div>


    </div>
  );
}
