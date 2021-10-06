import { Formik, Form, Field } from 'formik';
import * as React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import * as Yup from 'yup'
import "../Css/AddEditPopUp.css"
import { IAddForm, IAddFormCard, IAddFormFolder, IAddFormSet, IFolder } from "../../helpers/Interfaces"
import { useContext } from 'react';
import { AuthContext } from '../../helpers/Contexts';

export interface IAppProps {
    setAddPopUpOpen: React.Dispatch<React.SetStateAction<boolean>>;
    itemToAdd: string;
    folderId?: number; // for adding a set to a known folder 
    setId?: number; // for adding a card to a set
    getFolderOrSetOrCardList: any;
    listFolders?: IFolder[];
    addingLoneSet?: boolean;
    addingCard?: boolean;
}

export function AddPopUp({ setAddPopUpOpen, getFolderOrSetOrCardList, itemToAdd, folderId, listFolders, addingLoneSet, addingCard, setId }: IAppProps) {
    const { authState } = useContext(AuthContext)
    const initialValues = {
        name: "",
        folderToAddToId: 0,
        question: "",
        answer: "",
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(50),
        folderToAddToId: Yup.number(),
        question: Yup.string(),
        answer: Yup.string(),
    })

    const submit = (submittedData: IAddForm) => {
        let url
        let body
        console.log(`data`, submittedData)
        if (itemToAdd === 'folder') {
            console.log('detected properly');
            url = `https://studyweb-backend.herokuapp.com/api/v1/folders`
            body = JSON.stringify({
                folderName: submittedData.name,
                userId: authState.id
            })
        } else if (itemToAdd === 'set') {
            let folderToAddToId: any = submittedData.folderToAddToId
            if (folderToAddToId === 0) {
                folderToAddToId = null
            }

            if (folderId) {
                folderToAddToId = folderId
            }
            url = `https://studyweb-backend.herokuapp.com/api/v1/sets`
            body = JSON.stringify({
                setName: submittedData.name,
                folderId: folderToAddToId,
                userId: authState.id,
            })
        } else {
            url = `https://studyweb-backend.herokuapp.com/api/v1/cards`
            body = JSON.stringify({
                question: submittedData.question,
                answer: submittedData.answer,
                setId,
            })


        }
        fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                accessToken: localStorage.getItem("accessToken")!,
            },
            body: body
        })
            .then((response) => response.json())
            .then((data) => {
                setAddPopUpOpen(false)
                if (getFolderOrSetOrCardList != undefined) {
                    getFolderOrSetOrCardList()
                }
            })
            .catch((error) => console.log(error));

    }

    return (
        <div className="add_container">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={submit}
            >
                {({ errors, touched }) => (
                    <Form className="add_form">
                        <div className="add_title_container">
                            <h1 className="add_title">Create a new {itemToAdd}</h1>
                            <AiOutlineCloseCircle className="add_close_btn" onClick={() => { setAddPopUpOpen(false) }}></AiOutlineCloseCircle>
                        </div>

                        <div className="add_content_container">
                            {/* 
                           This for adding cards 
                           */}
                            {addingCard ? (
                                <>
                                    <div className="add_details">
                                        <label className="add_label required" htmlFor="">Question</label>
                                        <Field className="add_field" name="question" type="text" />
                                        {errors.question && touched.question ? <div className="add_field_errors">{errors.question}</div> : null}
                                    </div>
                                    <div className="add_details">
                                        <label className="add_label required" htmlFor="">Answer</label>
                                        <Field className="add_field" name="answer" type="text" />
                                        {errors.answer && touched.answer ? <div className="add_field_errors">{errors.answer}</div> : null}
                                    </div>
                                </>

                            ) : null}
                            {/* 
                            This is for both, adding set (known folder OR unknown), and adding folder
                            */}
                            {!addingCard ? (
                                <div className="add_details">
                                    <label className="add_label required" htmlFor="">New {itemToAdd} name</label>
                                    <Field className="add_field" name="name" type="text" />
                                    {errors.name && touched.name ? <div className="add_field_errors">{errors.name}</div> : null}
                                </div>
                            ) : null}
                            {/*
                            This is for adding set (unknown folder)
                            */}
                            {addingLoneSet && !addingCard ? (
                                <div className="add_details">
                                    <label className="add_label">Add set to a folder? </label>
                                    <Field className="add_field" name="folderToAddToId" as="select">
                                        <option className="add_field"
                                            value='0'>
                                            None
                                        </option>
                                        {
                                            listFolders?.map((oneFolder) => {
                                                return (
                                                    <option
                                                        className="add_field"
                                                        data-folderid={oneFolder.id}
                                                        value={oneFolder.id.toString()}>
                                                        {oneFolder.name}
                                                    </option>
                                                )
                                            })
                                        }
                                    </Field>
                                    {errors.folderToAddToId &&
                                        touched.folderToAddToId &&
                                        <div className="input-feedback">
                                            {errors.folderToAddToId}
                                        </div>}
                                </div>
                            ) : null}
                            <button className="add_button" type="submit">Add</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
