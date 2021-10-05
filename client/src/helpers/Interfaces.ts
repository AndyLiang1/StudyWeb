// =============================================================================
// Context
// =============================================================================
export interface AppContextInterface {
    name: string;
    id: number;
    loggedIn: boolean;
}

export interface AppContextPropsInterface {
    authState: AppContextInterface;
    setAuthState: (auth: AppContextInterface) => void
}

// export interface TimeContextInterface {
//     studyTimeInSec: number;
//     timeString: string;
//     triggerCountDown: boolean;
// }

// export interface TimeContextPropsInterface {
//     studyTimeInSec: number;
//     timeString: string;
//     triggerCountDown: boolean;
//     setStudyTimeInSec: (time: number) => void;
//     setTimeString: (time: string) => void;
//     setTriggerCountDown: (isOn: boolean) => void;
// }

export interface TimeContextInterface {
    studyTime: number;
    breakTime: number;
    timeString: string;
    timerStatus: string;
}

export interface TimeContextPropsInterface {
    studyTime: number;
    breakTime: number;
    timeString: string;
    timerStatus: string;
    multOptionErr: boolean,


    setStudyTime: (time: number) => void;
    setBreakTime: (time: number) => void;
    setTimeString: (time: string) => void;
    setTimerStatus: (status: string) => void;
    setMultOptionErr: (err: boolean) => void,


    setTimer: (studyDur: number, breakDur: number) => void;
    countDown: () => void;
    pause: () => void,
    reset: () => void,

}
// =============================================================================
// Other interfaces 
// =============================================================================
export interface IRegistrationForm {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface ILoginForm {
    email: string;
    password: string;
}

export interface IUser {
    name: string;
    id: number;
}

export interface IFolder {
    id: number;
    name: string;
    numSets: number;
    userId: number;
}
export interface ISet {
    id: number;
    name: string;
    numCards: number;
    folderId: number;
    userId: number;
}

export interface ICard {
    id: number;
    question: string;
    answer: string;
    setId: number;
}

// =============================================================================
// Forms 
// =============================================================================
export interface IAddFormFolder {
    name: string;
}

export interface IAddFormSet {
    name: string;
    folderToAddToId?: string;
}

export interface IAddFormCard {
    question: string;
    answer: string;
}

export interface IAddForm {
    name: string;
    folderToAddToId: number;
    question: string;
    answer: string;
}

export interface IEditForm {
    newName: string;
    newQuestion: string;
    newAnswer: string;
}

export interface ICustomTimerForm {
    studyDuration: string;
    breakDuration: string;
}


