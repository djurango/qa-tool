import React from 'react';
import './RootPage.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import * as ROUTES from '../../constants/routes'
import AccountPageContainer from "../AccountPage/AccountPageContainer";
import AddCasePageContainer from "../AddCasePage/AddCasePageContainer";
import AdminPageContainer from "../AdminPage/AdminPageContainer";
import EditCaseContainer from "../EditCasePage/EditCasePageContainer";
import HomePageContainer from "../HomePage/HomePageContainer";
import PasswordForgetPageContainer from "../PasswordForgetPage/PasswordForgetPageContainer";
import SignInPageContainer from "../SignInPage/SignInPageContainer";
import AddUserContainer from "../AdminPage/AddUser/AddUserContainer";
import PrivateRouteContainer from "../Ui/PrivateRoute/PrivateRouteContainer";
import AdminRouteContainer from "../Ui/AdminRoute/AdminRouteContainer";
import NavigationContainer from "./Navigation/NavigationContainer";
import LeadCheckListContainer from "../CheckLists/LeadCheckList/LeadCheckListContainer";
import WebCheckListContainer from "../CheckLists/WebCheckList.js/WebCheckListContainer";
import AddMasterDataContainer from "../AdminPage/MasterData/AddMasterData/AddMasterDataContainer";
import EditMasterDataContainer from "../AdminPage/MasterData/EditMasterData/EditMasterDataContainer";
import MasterDataListContainer from "../AdminPage/MasterData/MasterDataList/MasterDataListContainer";


function RootPage(props) {
    //TODO all Routes should be Pages?
    return (
        <Router>
            {props.auth.isEmpty ? null : <NavigationContainer/>}
            <Route path={ROUTES.SIGN_IN} component={SignInPageContainer}/>
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPageContainer}/>
            <PrivateRouteContainer exact path={ROUTES.HOME} component={HomePageContainer}/>
            <PrivateRouteContainer path={ROUTES.ACCOUNT} component={AccountPageContainer}/>
            <PrivateRouteContainer path={ROUTES.ADD_USER} component={AddUserContainer}/>
            <PrivateRouteContainer path={ROUTES.ADD_CASE} component={AddCasePageContainer}/>
            <PrivateRouteContainer path={ROUTES.EDIT_CASE + "/:id"} component={EditCaseContainer}/>
            <PrivateRouteContainer path={ROUTES.LEAD_CHECKS + "/:id"} component={LeadCheckListContainer}/>
            <PrivateRouteContainer path={ROUTES.WEB_CHECKS + "/:id"} component={WebCheckListContainer}/>

            {/* admin routes */}
            <AdminRouteContainer path={ROUTES.ADMIN} component={AdminPageContainer}/>
            <AdminRouteContainer path={ROUTES.ADD_MASTERDATA} component={AddMasterDataContainer}/>
            <AdminRouteContainer path={ROUTES.EDIT_MASTERDATA + "/:id"} component={EditMasterDataContainer}/>
            <AdminRouteContainer exact path={ROUTES.MASTERDATALIST} component={MasterDataListContainer}/>


        </Router>
    );
}


export default RootPage;
