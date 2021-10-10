import * as React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import "../Css/DeletePopUp.css"

export interface IDeletePopUpProps {
    setDeletePopUpOpen: React.Dispatch<React.SetStateAction<boolean>>;
    getFolderOrSetOrCardList: () => Promise<void>;
    setId?: number;
    folderId?: number;
    cardId?: number;
    itemToDelete: string;
    displayedIndex?: number;
    setDisplayedIndex?: React.Dispatch<React.SetStateAction<number>>
}



export function DeletePopUp({ setDeletePopUpOpen, getFolderOrSetOrCardList, setId, folderId, cardId, itemToDelete, displayedIndex, setDisplayedIndex }: IDeletePopUpProps) {

    const deleteOnClick = () => {
        let url
        if (itemToDelete === 'folder') {
            url = `https://studyweb-backend.herokuapp.com/api/v1/folders/${folderId}`
        } else if (itemToDelete === 'set') {
            url = `https://studyweb-backend.herokuapp.com/api/v1/sets/${setId}/${folderId}`
        } else {
            url = `https://studyweb-backend.herokuapp.com/api/v1/cards/${cardId}/${setId}`
        }

        fetch(url, {
            method: "DELETE",
            headers: {
                accessToken: localStorage.getItem("accessToken")!,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setDeletePopUpOpen(false)
                getFolderOrSetOrCardList()
                if (displayedIndex && setDisplayedIndex) {
                    setDisplayedIndex(displayedIndex - 1)

                }
            })
            .catch((error) => console.log(error));
    }

    return (
        <div className="delete_container">
            <div className="delete_title_container">
                <h1>Delete {itemToDelete}?</h1>
                <AiOutlineCloseCircle className="delete_close_btn"
                    onClick={() => setDeletePopUpOpen(false)}
                >
                </AiOutlineCloseCircle>
            </div>
            <div className="delete_content_container">
                <button
                    onClick={() => deleteOnClick()}
                    className="delete_yes_button"
                >Yes</button>
                <button
                    onClick={() => setDeletePopUpOpen(false)}
                    className="delete_no_button"
                >No</button>
            </div>
        </div>
    );
}
