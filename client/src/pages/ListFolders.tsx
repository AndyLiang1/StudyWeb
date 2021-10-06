import * as React from 'react';
import { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { AiOutlineFolder, AiOutlinePlus } from 'react-icons/ai';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { BsPlusSquare } from 'react-icons/bs'
import { DeletePopUp } from '../components/CRUD/DeletePopUp';
import { EditPopUp } from '../components/CRUD/EditPopUp';
import { NavigationBar } from '../components/Navbar';
import { Profile } from '../components/Profile';
import { AuthContext, TimerContext } from '../helpers/Contexts';
import { IFolder } from '../helpers/Interfaces';
import "./Css/ListPage.css"
import { AddPopUp } from '../components/CRUD/AddPopUp';

export interface IListFoldersProps {
}

export function ListFolders(props: IListFoldersProps) {
    const { authState, setAuthState } = useContext(AuthContext);
    const { studyTimeInSec, timeString, triggerCountDown, setStudyTimeInSec,
        setTimeString, setTriggerCountDown } = useContext(TimerContext)
    const [numFolders, setNumFolders] = useState<number>(0)
    const [numSets, setNumSets] = useState<number>(0)
    const [addFolderPopUpOpen, setAddFolderPopUpOpen] = useState<boolean>(false)
    const [editFolderPopUpOpen, setEditFolderPopUpOpen] = useState<boolean>(false)
    const [deleteFolderPopUpOpen, setDeleteFolderPopUpOpen] = useState<boolean>(false)
    const [folderId, setFolderId] = useState<number>(0)
    // const [folderId, setFolderId] = useState<number>(0)
    const [folders, setFolders] = useState<IFolder[]>([])
    let history = useHistory()

    const getFolderList = async () => {
        fetch(`https://bubbletea-expense-tracker.herokuapp.com/api/v1/folders/${authState.id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")!,
            },
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                setFolders(responseJSON.foldersList)
                setNumFolders(responseJSON.length)
            })
            .catch((error) => {
                console.log(error);
            });
        fetch(`https://bubbletea-expense-tracker.herokuapp.com/api/v1/sets/all/${authState.id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")!,
            },
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                setNumSets(responseJSON.length)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const goToSetsPage = async (event: React.MouseEvent<HTMLElement>) => {
        const folderId: number = parseInt(event.currentTarget.getAttribute("data-folderid")!)
        const folderName: string = event.currentTarget.getAttribute("data-foldername")!
        history.push({
            pathname: "/listOneFolder",
            state: {
                folderIdFromURL: folderId,
                numFolders,
                folderName,
            }
        })
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

    useEffect(() => {
        getFolderList()
    }, [authState])

    const editBtnOnClick = (event: React.MouseEvent<SVGElement>) => {
        const setId: string = event.currentTarget.getAttribute("data-setid")!
        if (deleteFolderPopUpOpen) {
            setDeleteFolderPopUpOpen(false)
        }
        setFolderId(parseInt(setId))
        setEditFolderPopUpOpen(true)
    }

    const deleteBtnOnClick = (event: React.MouseEvent<SVGElement>) => {
        // const folderId: string = event.currentTarget.getAttribute("data-setid")!
        const folderId: string = event.currentTarget.getAttribute("data-folderid")!
        if (editFolderPopUpOpen) {
            setEditFolderPopUpOpen(false)
        }
        // setFolderId(parseInt(folderId))
        setFolderId(parseInt(folderId))
        setDeleteFolderPopUpOpen(true)
    }

    return (
        <div className="list_page">
            <NavigationBar loggedIn={authState.loggedIn}></NavigationBar>
            <div className="profile_section_container">
                <Profile
                    name={authState.name}
                    numFolders={numFolders}
                    numSets={numSets}
                />
            </div>
            <h1 className="description">Your folders</h1>
            <div
                className="add_item"
                onClick={() => setAddFolderPopUpOpen(true)}
            >
                <AiOutlinePlus
                    className="plus_btn"></AiOutlinePlus>
            </div>
            <div className="list_page_content">
                {folders.map((oneFolder) => {
                    return (
                        <div
                            className="one_item"
                            key={oneFolder.id}
                        >
                            <div
                                onClick={goToSetsPage}
                                data-folderid={oneFolder.id}
                                data-foldername={oneFolder.name}
                                className="one_item_not_btn_wrapper"
                            >
                                <div
                                    className="one_item_title_container"
                                >
                                    <div className="one_item_folderImg_container">
                                        <AiOutlineFolder className="one_item_folderIcon"></AiOutlineFolder>
                                    </div>
                                    <div className="one_item_name" >{oneFolder.name}</div>

                                </div>

                                <div className="one_item_numChild">Sets: {oneFolder.numSets}</div>
                            </div>

                            <div
                                className="one_item_btn_container">
                                <FaEdit
                                    onClick={editBtnOnClick}
                                    className="one_item_edit_btn"
                                    data-setid={oneFolder.id}
                                />
                                <FaTrashAlt
                                    onClick={deleteBtnOnClick}
                                    className="one_item_delete_btn"
                                    data-folderid={oneFolder.id}
                                ></FaTrashAlt>
                            </div>
                        </div>
                    )
                })}
            </div>
            {addFolderPopUpOpen ? (
                <div className="list_page_add_container">
                    <AddPopUp
                        setAddPopUpOpen={setAddFolderPopUpOpen}
                        getFolderOrSetOrCardList={getFolderList}
                        itemToAdd="folder"
                    ></AddPopUp>
                </div>
            ) : null}
            {editFolderPopUpOpen ? (
                <div className="list_page_edit_container">
                    <EditPopUp
                        setEditPopUpOpen={setEditFolderPopUpOpen}
                        getFolderOrSetOrCardList={getFolderList}
                        folderId={folderId}
                        itemToEdit="folder"
                    ></EditPopUp>
                </div>
            ) : null}
            {deleteFolderPopUpOpen ? (
                <div className="list_page_delete_container">
                    <DeletePopUp
                        setDeletePopUpOpen={setDeleteFolderPopUpOpen}
                        getFolderOrSetOrCardList={getFolderList}
                        folderId={folderId}
                        itemToDelete="folder"
                    ></DeletePopUp>
                </div>
            ) : null}


        </div >
    );
}
