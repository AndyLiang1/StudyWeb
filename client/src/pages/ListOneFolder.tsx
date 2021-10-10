import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { RiStackFill } from 'react-icons/ri';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { NavigationBar } from "../components/Navbar"
import { EditPopUp } from "../components/CRUD/EditPopUp"
import { Profile } from '../components/Profile';
import { AuthContext } from '../helpers/Contexts';
import { ISet } from '../helpers/Interfaces';
import "./Css/ListPage.css"
import { DeletePopUp } from '../components/CRUD/DeletePopUp'
import { useHistory, useLocation } from "react-router-dom";
import { AiOutlinePlus } from 'react-icons/ai';
import { AddPopUp } from '../components/CRUD/AddPopUp';


export interface IListOneFolderProps {

}

export function ListOneFolder(props: IListOneFolderProps) {
    const { authState, setAuthState } = useContext(AuthContext);
    const [numSets, setNumSets] = useState<number>(0)
    const [addSetPopUpOpen, setAddSetPopUpOpen] = useState<boolean>(false)
    const [editSetPopUpOpen, setEditSetPopUpOpen] = useState<boolean>(false)
    const [deleteSetPopUpOpen, setDeleteSetPopUpOpen] = useState<boolean>(false)
    const [setId, setSetId] = useState<number>(0)
    const [folderId, setFolderId] = useState<number>(0)
    const [sets, setSets] = useState<ISet[]>([])
    const history = useHistory()
    /**
     * This section is needed because clicking on the hamburger icon, this
     * component is re-rendered and it's location no longer has a location.state.
     */
    const location = useLocation<{ folderIdFromURL: number, numFolders: number, folderName: string }>()
    const [folderIdFromURL, setFolderIdFromURL] = useState<number>(0)
    const [numFolders, setNumFolders] = useState<number>(0)
    const [folderName, setFolderName] = useState<string>("def_folderName")
    if (location.state != undefined && folderName === "def_folderName") {
        localStorage.setItem("folderIdFromURL", location.state.folderIdFromURL.toString())
        localStorage.setItem("numFolders", location.state.numFolders.toString())
        localStorage.setItem("folderName", location.state.folderName)
        setFolderIdFromURL(location.state.folderIdFromURL)
        setNumFolders(location.state.numFolders)
        setFolderName(location.state.folderName)
    }

    const getSetList = async () => {
        fetch(`https://studyweb-backend.herokuapp.com/api/v1/sets/all/${authState.id}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")!,
            },
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                setNumSets(responseJSON.length)
                const setsInFolder: ISet[] = responseJSON.setsList.filter((oneSet: ISet) => {
                    if (oneSet.folderId === folderIdFromURL) {
                        return oneSet
                    }
                })
                setSets(setsInFolder)
            })
            .catch((error) => {
                console.log(error);
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
        setFolderIdFromURL(parseInt(localStorage.getItem("folderIdFromURL")!))
        setNumFolders(parseInt(localStorage.getItem("numFolders")!))
        setFolderName(localStorage.getItem("folderName")!)
    }, [])

    useEffect(() => {
        getSetList()
    }, [authState])

    const editBtnOnClick = (event: React.MouseEvent<SVGElement>) => {
        const setId: string = event.currentTarget.getAttribute("data-setid")!
        if (deleteSetPopUpOpen) {
            setDeleteSetPopUpOpen(false)
        }
        setSetId(parseInt(setId))
        setEditSetPopUpOpen(true)
    }

    const deleteBtnOnClick = (event: React.MouseEvent<SVGElement>) => {
        const setId: string = event.currentTarget.getAttribute("data-setid")!
        const folderId: string = event.currentTarget.getAttribute("data-folderid")!
        if (editSetPopUpOpen) {
            setEditSetPopUpOpen(false)
        }
        setSetId(parseInt(setId))
        setFolderId(parseInt(folderId))
        setDeleteSetPopUpOpen(true)
    }

    const addSet = () => {
        setAddSetPopUpOpen(true)
    }

    const cleanLocalStorage = () => {
        localStorage.removeItem("folderIdFromURL")
        localStorage.removeItem("numFolders")
        localStorage.removeItem("folderName")
    }
    const goToCardsPage = ((event: React.MouseEvent<HTMLElement>) => {
        const setId: number = parseInt(event.currentTarget.getAttribute("data-setid")!)
        const setName: string = event.currentTarget.getAttribute("data-setname")!
        cleanLocalStorage()
        history.push({
            pathname: "/listCards",
            state: {
                setId,
                setName,
                numFolders,
                numSets,
            }
        })
    })

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
            <h1 className="description">{folderName}'s sets</h1>
            <div
                onClick={addSet}
                className="add_item"
            >
                <AiOutlinePlus className="plus_btn"></AiOutlinePlus>
            </div>
            <div className="list_page_content">
                {sets.map((oneSet) => {
                    return (
                        <div
                            className="one_item"
                            key={oneSet.id}
                        >
                            <div
                                onClick={goToCardsPage}
                                data-setid={oneSet.id}
                                data-setname={oneSet.name}
                                className="one_item_not_btn_wrapper"
                            >
                                <div className="one_item_title_container">
                                    <div className="one_item_folderImg_container">
                                        <RiStackFill className="one_item_folderIcon"></RiStackFill>
                                    </div>
                                    <div className="one_item_name">{oneSet.name}</div>

                                </div>
                                <div className="one_item_numChild">Cards: {oneSet.numCards}</div>
                            </div>

                            <div
                                className="one_item_btn_container">
                                <FaEdit
                                    onClick={editBtnOnClick}
                                    className="one_item_edit_btn"
                                    data-setid={oneSet.id}
                                />
                                <FaTrashAlt
                                    onClick={deleteBtnOnClick}
                                    className="one_item_delete_btn"
                                    data-setid={oneSet.id}
                                    data-folderid={oneSet.folderId}
                                ></FaTrashAlt>
                            </div>
                        </div>
                    )
                })}
            </div>
            {
                addSetPopUpOpen ? (
                    <div className="list_page_add_container">
                        <AddPopUp
                            setAddPopUpOpen={setAddSetPopUpOpen}
                            getFolderOrSetOrCardList={getSetList}
                            folderId={folderIdFromURL}
                            itemToAdd="set"
                        ></AddPopUp>
                    </div>
                ) : null
            }
            {
                editSetPopUpOpen ? (
                    <div className="list_page_edit_container">
                        <EditPopUp
                            setEditPopUpOpen={setEditSetPopUpOpen}
                            getFolderOrSetOrCardList={getSetList}
                            setId={setId}
                            itemToEdit="set"
                        ></EditPopUp>
                    </div>
                ) : null
            }
            {
                deleteSetPopUpOpen ? (
                    <div className="list_page_delete_container">
                        <DeletePopUp
                            setDeletePopUpOpen={setDeleteSetPopUpOpen}
                            getFolderOrSetOrCardList={getSetList}
                            setId={setId}
                            folderId={folderId}
                            itemToDelete="set"
                        ></DeletePopUp>
                    </div>
                ) : null
            }
        </div >
    );
}
