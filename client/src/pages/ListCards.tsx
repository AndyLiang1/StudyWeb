import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext, TimerContext } from '../helpers/Contexts';
import { ICard, ISet } from '../helpers/Interfaces';
import "./Css/ListCards.css"
import ReactCardFlip from 'react-card-flip';
import { BsArrowLeftShort, BsArrowRightShort, BsPlusSquare } from 'react-icons/bs';
import { Profile } from '../components/Profile';
import { NavigationBar } from '../components/Navbar';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import { FiPlusSquare, FiEdit, FiTrash2 } from 'react-icons/fi'
import { AddPopUp } from '../components/CRUD/AddPopUp';
import { DeletePopUp } from '../components/CRUD/DeletePopUp';
import { EditPopUp } from '../components/CRUD/EditPopUp';
import { setNestedObjectValues } from 'formik';
import { AiOutlinePauseCircle, AiOutlinePlayCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { IoRefreshOutline } from 'react-icons/io5';
export interface IListCardsProps {
}

export function ListCards(props: IListCardsProps) {
    const { authState, setAuthState } = useContext(AuthContext);
    /**
     * This section is needed because clicking on the hamburger icon, this
     * component is re-rendered and it's location no longer has a location.state.
     */
    const [setId, setSetId] = useState<number>(0)
    const [setName, setSetName] = useState<string>("def_setName")
    const location = useLocation<{ setId: number, setName: string }>()
    if (location.state != undefined && setName === "def_setName" && setId === 0) {
        setSetId(location.state.setId)
        setSetName(location.state.setName)
        localStorage.setItem("setId", location.state.setId.toString())
        localStorage.setItem("setName", location.state.setName)
    }

    const [addPopUpOpen, setAddPopUpOpen] = useState<boolean>(false)
    const [editPopUpOpen, setEditPopUpOpen] = useState<boolean>(false)
    const [deletePopUpOpen, setDeletePopUpOpen] = useState<boolean>(false)
    const [sets, setSets] = useState<ISet[]>([])
    const [cards, setCards] = useState<ICard[]>([])
    const [cardId, setCardId] = useState<number>(0)
    const [displayedIndex, setDisplayedIndex] = useState<number>(1) // this is one higher than array index
    const [isFlipped, setIsFlipped] = React.useState<boolean>(false);
    const { timeString, timerStatus, pause, reset, setTimerStatus } = useContext(TimerContext)

    const getCardList = async () => {
        fetch(`https://studyweb-backend.herokuapp.com/api/v1/cards/${setId}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")!,
            },
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                setCards(responseJSON.cardsList)
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
        setSetId(parseInt(localStorage.getItem("setId")!))
        setSetName(localStorage.getItem("setName")!)
    }, [])

    useEffect(() => {
        getCardList()
    }, [authState])

    const handleFlip = (() => {
        setIsFlipped(!isFlipped)
    })


    const changeIndex = (direction: string) => {
        if (displayedIndex == 1 && direction === 'neg') {
            return
        }
        if (displayedIndex == cards.length && direction === 'pos') {
            return
        }
        let index;
        if (direction == "neg") {
            index = displayedIndex - 1;
            setIsFlipped(false)
            setDisplayedIndex(index)
        } else {
            index = displayedIndex + 1;
            setIsFlipped(false)
            setDisplayedIndex(index)
        }
    }

    const addBtnOnClick = () => {
        setAddPopUpOpen(true)
    }
    const editBtnOnClick = () => {
        if (cards.length === 0) {
            return;
        }
        setEditPopUpOpen(true)
    }
    const deleteBtnOnClick = () => {
        if (cards.length === 0) {
            return;
        }
        setDeletePopUpOpen(true)
    }

    return (
        <div className="list_cards_page">
            <NavigationBar loggedIn={authState.loggedIn}></NavigationBar>
            <div className="list_cards_page_content">
                {timerStatus === 'study' || timerStatus === 'break'
                    || timerStatus === 'studyPause' || timerStatus === 'breakPause' ? (
                        <div className="list_cards_title_container">
                            <div className="list_cards_set_title">
                                {setName}
                            </div>
                            <div className="list_cards_timer_container">
                                {timerStatus === 'study' || timerStatus === 'studyPause' ? (
                                    <div className="list_cards_timer">
                                        Study Time Remaining: {timeString}
                                    </div>
                                ) : null}
                                {timerStatus === 'break' || timerStatus === 'breakPause' ? (
                                    <div className="list_cards_timer">
                                        Break Time Remaining: {timeString}
                                    </div>
                                ) : null}
                                {!(timerStatus === 'studyPause' || timerStatus === 'breakPause') ? (
                                    <AiOutlinePauseCircle onClick={() => pause()} className="list_cards_pauseplay_refresh_close_btn"></AiOutlinePauseCircle>
                                ) : (
                                        <AiOutlinePlayCircle onClick={() => pause()} className="list_cards_pauseplay_refresh_close_btn"></AiOutlinePlayCircle>
                                    )}
                                <IoRefreshOutline onClick={() => reset()} className="list_cards_pauseplay_refresh_close_btn"></IoRefreshOutline>
                                <AiOutlineCloseCircle className="list_cards_pauseplay_refresh_close_btn" onClick={() => { setTimerStatus("killed") }}></AiOutlineCloseCircle>
                            </div>
                        </div>
                    ) : (
                        <div className="list_cards_title_container">
                            <div className="list_cards_set_title">
                                {setName}
                            </div>
                            <div className="list_cards_timer">
                                Time Remaining: No Timer Set
                            </div>
                        </div>
                    )}

                <div className="list_cards_card_section">
                    <div className="list_cards_card_container">
                        <div className="list_cards_card">
                            <ReactCardFlip
                                containerStyle={{
                                    height: "70%",
                                    width: "60%",
                                }}
                                isFlipped={isFlipped} flipDirection="vertical">
                                <div onClick={handleFlip} className="list_cards_card_front">
                                    {cards[displayedIndex - 1] ? cards[displayedIndex - 1].question : "You have no cards in this set. Create a card with the plus button!"}
                                </div>
                                <div onClick={handleFlip} className="list_cards_card_back">
                                    {cards[displayedIndex - 1] ? cards[displayedIndex - 1].answer : "You have no cards in this set. Create a card with the plus button!"}
                                </div>
                            </ReactCardFlip>
                        </div>
                    </div>

                    <div className="list_cards_change_card">
                        <BsArrowLeftShort
                            onClick={() => changeIndex("neg")}
                            className="list_cards_arrow_btn"></BsArrowLeftShort>
                        <h3 className="list_cards_display_index">{displayedIndex}/{cards.length}</h3>
                        <BsArrowRightShort
                            onClick={() => changeIndex("pos")}
                            className="list_cards_arrow_btn"></BsArrowRightShort>
                    </div>
                </div>

                <div className="list_cards_card_CRUD">
                    <FiPlusSquare
                        onClick={addBtnOnClick}
                        className="list_cards_add_btn"></FiPlusSquare>
                    <FiEdit
                        onClick={editBtnOnClick}
                        className="list_cards_edit_btn"></FiEdit>
                    <FiTrash2
                        onClick={deleteBtnOnClick}
                        className="list_cards_delete_btn"></FiTrash2>
                </div>
            </div>

            {
                addPopUpOpen ? (
                    <div className="list_page_add_container">
                        <AddPopUp
                            setAddPopUpOpen={setAddPopUpOpen}
                            getFolderOrSetOrCardList={getCardList}
                            setId={setId}
                            itemToAdd="card"
                            addingCard={true}
                        ></AddPopUp>
                    </div>
                ) : null
            }
            {
                editPopUpOpen ? (
                    <div className="list_page_edit_CARD_container">
                        <EditPopUp
                            setEditPopUpOpen={setEditPopUpOpen}
                            getFolderOrSetOrCardList={getCardList}
                            cardId={cards[displayedIndex - 1].id}
                            itemToEdit="card"
                            editCard={true}
                        ></EditPopUp>
                    </div>
                ) : null
            }
            {
                deletePopUpOpen ? (
                    <div className="list_page_delete_container">
                        <DeletePopUp
                            setDeletePopUpOpen={setDeletePopUpOpen}
                            getFolderOrSetOrCardList={getCardList}
                            setId={setId}
                            cardId={cards[displayedIndex - 1].id}
                            itemToDelete="card"
                            displayedIndex={displayedIndex}
                            setDisplayedIndex={setDisplayedIndex}
                        ></DeletePopUp>
                    </div>
                ) : null
            }
        </div>



    );
}