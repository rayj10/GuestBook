/**
 * Functions to validate user inputs, make sure each field is not empty, validate the email address and password.
 * After validation, it returns the success variable and the error object.
 */

export function isEmpty(str) {
    if (str && str.replace(/\ /g, '') !== '')
        return false;
    else {
        return true;
    }
}

function validatePhoneNumber(phone) {
    //remove unwanted symbols if there's any, then change the first number to indonesian country code by default if it's 0
    var simple = phone.replace('+', '');
    simple = simple.replace(/[\(\)\.\-\ ]/g, '');
    if (simple.charAt(0) === '0')
        simple = simple.replace('0', '62');

    var phoneno = /^\d{10}$|^\d{11}$|^\d{12}$|^\d{13}$/;

    if (simple.match(phoneno)) {
        return true;
    }
    else {
        return false;
    }
}

function validateEmail(email) {
    var mail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email.match(mail)) {
        return true;
    }
    else {
        return false;
    }
}

function validatePhone(phone) {
    //remove unwanted symbols if there's any, then change the first number to indonesian country code by default if it's 0
    var simple = phone.replace('+', '');
    simple = simple.replace(/[\(\)\.\-\ ]/g, '');
    if (simple.charAt(0) === '0')
        simple = simple.replace('0', '62');

    var nonNumber = /([A-Z])+/gi;

    if (!simple.match(nonNumber)) {
        return true;
    }
    else {
        return false;
    }
}

export function validate(form) {
    let error = {};
    let success = true;

    var keys = Object.keys(form);
    var hasMobile = form['mobile'] && !isEmpty(form['mobile'].value), hasPhone = form['phone'] && !isEmpty(form['phone'].value), hasOffice = form['office'] && !isEmpty(form['office'].value);

    keys.map(field => {
        if (field !== "error" && field !== "submitted") {
            var { value } = form[field];

            if (field === 'mobile' || field === 'phone' || field === 'office') {
                if (hasMobile && field === 'mobile') {
                    if (!validatePhoneNumber(value)) {
                        error[field] = 'Invalid Mobile Phone Number';
                        success = false;
                    }
                }
                else if (hasPhone && field === 'phone') {
                    if (!validatePhone(value)) {
                        error[field] = 'Invalid Phone Number';
                        success = false;
                    }
                }
                else if (hasOffice && field === 'office') {
                    if (!validatePhone(value)) {
                        error[field] = 'Invalid Office Phone Number';
                        success = false;
                    }
                }
                //if current field is empty, just check the other 2 fields first, if all of them empty, add required field to current one
                else if (!hasMobile && !hasPhone && !hasOffice) {
                    error[field] = 'Required Field';
                    success = false;
                }
            }
            //if not one of the 3 special cases, check isEmpty and validate
            else if (isEmpty(value)) {
                error[field] = 'Required Field';
                success = false;
            }
            else {
                if (field === 'email' && !validateEmail(value)) {
                    error[field] = 'Invalid Email Address';
                    success = false;
                }
                if (field === 'gender' && !(value === 'Male' || value === 'Female')) {
                    error[field] = 'Gender selection required';
                    success = false;
                }
            }
        }
    });
    return { success, error };
}
