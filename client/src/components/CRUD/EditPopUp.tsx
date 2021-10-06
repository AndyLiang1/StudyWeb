import { Formik, Form, Field } from 'formik';
import * as React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import * as Yup from 'yup'
import "../Css/AddEditPopUp.css"
import { IEditForm } from "../../helpers/Interfaces"

export interface IAppProps {
    setEditPopUpOpen: React.Dispatch<React.SetStateAction<boolean>>;
    getFolderOrSetOrCardList: () => Promise<void>;
    setId?: number;
    folderId?: number;
    cardId?: number;
    itemToEdit: string;
    editCard?: boolean;
}

export function EditPopUp({ setEditPopUpOpen, getFolderOrSetOrCardList, setId, folderId, cardId, itemToEdit, editCard }: IAppProps) {

    const initialValues = {
        newName: "",
        newQuestion: "",
        newAnswer: "",

    }

    const validationSchema = Yup.object().shape({
        newName: Yup.string().max(50),
        newQuestion: Yup.string(),
        newAnswer: Yup.string(),
    })

    const submit = (submittedData: IEditForm) => {
        console.log('submittedData', submittedData)
        let url;
        let body;
        if (itemToEdit === 'folder') {
            url = `https://bubbletea-expense-tracker.herokuapp.com/api/v1/folders`
            body = JSON.stringify({
                newFolderName: submittedData.newName,
                id: folderId
            })
        } else if (itemToEdit === 'set') {
            url = `https://bubbletea-expense-tracker.herokuapp.com/api/v1/sets`
            body = JSON.stringify({
                newSetName: submittedData.newName,
                id: setId
            })
        } else {
            url = `https://bubbletea-expense-tracker.herokuapp.com/api/v1/cards`
            body = JSON.stringify({
                newQuestion: submittedData.newQuestion,
                newAnswer: submittedData.newAnswer,
                id: cardId
            })
        }
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                accessToken: localStorage.getItem("accessToken")!,
            },
            body: body
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(`data is: `, data)
                setEditPopUpOpen(false)
                getFolderOrSetOrCardList()
            })
            .catch((error) => console.log(error));
    }


    return (
        <div className="edit_container">

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={submit}
            >
                {({ errors, touched }) => (
                    <Form className="edit_form">

                        <div className="edit_title_container">
                            <h1 className="edit_title">Edit this {itemToEdit}</h1>

                            <AiOutlineCloseCircle className="edit_close_btn" onClick={() => { setEditPopUpOpen(false) }}></AiOutlineCloseCircle>
                        </div>

                        <div className="edit_content_container">
                            {editCard ? (
                                <>
                                    <div className="add_details">
                                        <label className="add_label required" htmlFor="">Question</label>
                                        <Field className="add_field" name="newQuestion" type="text" />
                                        {errors.newQuestion && touched.newQuestion ? <div className="add_field_errors">{errors.newQuestion}</div> : null}
                                    </div>
                                    <div className="add_details">
                                        <label className="add_label required" htmlFor="">Answer</label>
                                        <Field className="add_field" name="newAnswer" type="text" />
                                        {errors.newAnswer && touched.newAnswer ? <div className="add_field_errors">{errors.newAnswer}</div> : null}
                                    </div>
                                </>

                            ) : (
                                    <div className="edit_details">
                                        <label className="edit_label required" htmlFor="">New {itemToEdit} name</label>
                                        <Field className="edit_field" name="newName" type="text" />
                                        {errors.newName && touched.newName ? <div className="edit_field_errors">{errors.newName}</div> : null}
                                    </div>
                                )}




                            <button className="edit_button" type="submit">Edit</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
