import React, {useState} from 'react';
import SimpleSnackbarContainer from "../../../Ui/Snackbar/SimpleSnackbarContainer";
import MasterDataForm from "../../../Ui/MasterDataForm/MasterDataForm";

function AddMasterData(props) {

    const initialState = {
        customer: '',
        projectId: '',
        product: ''
    };

    const [state, setState] = useState(initialState);

    const onSubmit = event => {
        event.preventDefault();
        props.createMasterData(state);
        setState(initialState);
    };

    const onChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    };


    return (
        <div>
            <MasterDataForm onSubmit={onSubmit} onChange={onChange} state={state} title={"Add Masterdata"}/>
            <SimpleSnackbarContainer/>
        </div>

    );
}


export default AddMasterData;