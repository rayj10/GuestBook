import * as t from './actionTypes/authTypes';
import { fetchAPI } from '../utils/fetch';

/**
 * Check if the device used is already registered on the database
 * @param {String} id: Device ID unique to device and each installation 
 * @param {Function} finishCB: Callback to be executed once checking is done 
 */
export function checkDeviceID(id, finishCB) {
    var endpoint = `api.php?method=Cek_DeviceId&device_id=${id}&key=xkRKJui9acBcx4CG/UAdasjajH==`;

    let header = {
        "Content-Type": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header, null)
            .then((json) => { console.log(json)
                if (json.Detail['0'] === 0) {
                    dispatch({ type: t.LOGGED_OUT, id });
                }
                else {
                    dispatch({ type: t.LOGGED_IN, id, staff: { div: json.Detail.div_id, staffID: json.Detail.staff_id } });
                }
                finishCB(json.Detail['0'] === 1, json.Detail.staff_id);
            })
            .catch((error) => {
                dispatch({ type: t.LOGGED_OUT, id });
                finishCB(false);
            })
    }
}

/**
 * Get profile picture and name from intranet
 * @param {String} empID: User's Employee ID (NIK) 
 */
export function getIntranetDetails(empID) {
    var endpoint = `api.php?method=DetailStaff&staff_id=${empID}&key=xkRKJui9acBcx4CG/HCeboyIDF==`;

    let header = {
        "Content-Type": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header, null)
            .then((json) => {
                dispatch({ type: t.RECEIVE_INTRANET_DETAILS, intranet: { name: json.Detail.FULLNAME, scheduleType: json.Detail.TYPE_ABSEN, pic: { uri: 'data:image/jpg;base64,' + json.Detail.IMAGE_PROFILE } } });
            })
            .catch((error) => {
                console.log(error);
                dispatch({ type: t.EMPTY_INTRANET_DETAILS });
            })
    }
}

/**
 * Register user to database along with their device ID and firebase-generated token
 * @param {Object} user: User's login credentials (Destructured into { username, password })
 * @param {String} id: device unique ID to be registered
 * @param {String} token: device push notification token to be registered
 * @param {Function} finishCB: Callback to be executed once the fetching process is done
 */
export function register({ username, password }, id, token, finishCB) {
    var endpoint = `api.php?method=Register_DeviceId&username=${username}&password=${password}&device_id=${id}&token=${token}&key=xkRKJui9acBcx4CG/UAdasjajH==`;

    let header = {
        "Content-Type": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header, null)
            .then((json) => {
                console.log(json, id)
                if (json.Detail['0'] === 1) {
                    dispatch({ type: t.LOGGED_IN, id, staff: { div: json.Detail.div_id, staffID: json.Detail.staff_id } });
                    dispatch({ type: t.NEW_TOKEN, token });
                }
                finishCB(json.Detail['0'] === 1, json.Detail['0'] === 1 ? json.Detail['staff_id'] : json.Detail['Error']);
            })
            .catch((error) => {
                dispatch({ type: t.LOGGED_OUT, id });
                finishCB(false, error.message);
            })
    }
}

/**
 * Update push notification token stored on the server
 * @param {String} newToken: New token to be stored
 * @param {String} id: Device Unique ID related to the token
 * @param {String} staffID: Staff ID (NIK) related to the token (device owner)
 */
export function updateToken(newToken, id, staffID) {
    var endpoint = `api.php?method=StaffUpdateToken&staff_id=${staffID}&device_id=${id}&token=${newToken}&key=xkRKJui9acBcx4CG/UAdasjajH==`;

    let header = {
        "Content-Type": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header, null)
            .then((json) => {
                if (json.Detail['0'] === 1)
                    dispatch({ type: t.NEW_TOKEN, token: newToken });
            })
            .catch((error) => {
                console.log(error);
            })
    }
}

/**
 * Reset badge count on the server identified by the token and staff ID provided
 * @param {String} token: Token to identify which device to update 
 * @param {String} staffID: Staff ID (NIK) to be updated
 */
export function updateBadge(token, staffID) {
    var endpoint = `api.php?method=UpdateReadNotif&staff_id=${staffID}&token=${token}&key=xkRKJui9acBcx4CG/UAdasjajH==`;

    let header = {
        "Content-Type": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header, null)
            .then((json) => {
                return json.Detail['0'] === 1
            })
            .catch((error) => {
                console.log(error);
                return false;
            })
    }
}