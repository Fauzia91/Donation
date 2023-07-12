//const urlLocal = 'http://localhost:3001/graphql';
const url = 'graphql';

const SERVER_API_TOKEN = "SERVER_API_TOKEN";
let token = sessionStorage.getItem(SERVER_API_TOKEN);;
function setToken(t) {
    token = t;
    console.log("setToken", t);
    sessionStorage.setItem(SERVER_API_TOKEN, t);
}
function getToken() {
    token = sessionStorage.getItem(SERVER_API_TOKEN);
    return token;
}
function getServerURL() { return url; }

export default class APIRequest {
    static setToken(t) {
        if ((t + "").length < 100) {
            console.log("Invalid token");
            return false;
        }
        token = t;
        console.log("APIRequest.setToken", t);
        sessionStorage.setItem(SERVER_API_TOKEN, t);
        return true;
    }
    static async logout() {
        console.log("LOGOUT:", SERVER_API_TOKEN);
        // graphql call to server to logout
        const q = "query {logout }";
        const response = await APIRequest.server(q);
        const responseText = await response.text();
        // end graphql call

        // remove token from client storage
        sessionStorage.removeItem(SERVER_API_TOKEN);

        return responseText; // send response from server back to component
    }
    static async auth(username, password) {
        try {
            // graphql call to server to authenticate
            const query = `mutation{
                    authenticate(name:"${username}", password:"${password}")
                }`;
            const headers = {
                'Content-Type': 'application/json'
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    query: query,
                }),
            });
            const responseText = await response.text();
            const responseData = JSON.parse(responseText);
            const token = responseData.data.authenticate;
            
            // save token to client storage
            setToken(token);
            // return token and status to login component.
            return { status: 1, token: token, message: "registered" };
        } catch (e) { // error occurred, notify component.
            return { status: -1, token: "", message: "Invalid login", error:e };
        }
    }
    // called from register component with values from register form
    static async register(username, lastname, firstname, password1, password2) {
        try {
            // prepare graphql call
            const query = `mutation{
                reg(lastName: "${lastname}",firstName: "${firstname}", email:"${username}", password1:"${password1}", password2:"${password2}")
            }`;
            const headers = {
                'Content-Type': 'application/json'
            }
            // make graphql call
            const response = await APIRequest.graphql(query);
            // process response from server.
            const responseText = await response.text();        
            const responseData = JSON.parse(responseText);

            // store token to client storage
            const token = responseData.data.reg;
            setToken(token)
            // return status and token to register component.
            return { status: 1, token: token, message: "registered" };
        } catch (e) {// error occurred, report to register component.
            return { status: -1, token: "", message: "failed registration", error:e };
        }
    }
    // helper method to make a graphql call
    static async graphql(query, token=null) {
        token = sessionStorage.getItem(SERVER_API_TOKEN);
        const headers = token ?
            {
                'Content-Type': 'application/json',
                'x-access-token': `${token}`
            }
            :
            {
                'Content-Type': 'application/json'
            }

        //console.log("HEADERS:", headers);
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                query: query,
            }),
        });
        return response;
    }
    static async server(query) {
        token = sessionStorage.getItem(SERVER_API_TOKEN);
        const headers = token ?
            {
                'Content-Type': 'application/json',
                'x-access-token': `${token}`
            }
            :
            {
                'Content-Type': 'application/json'
            }

        console.log("HEADERS:", headers);
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                query: query,
            }),
        });
        return response;
    }

    // method to make a donation from dashboard.
    static async donate(amount) {
        // prepare graphql call
        const q = `mutation{
                    donate(amount: ${amount})
                }`
        // make call and get response
        const response = await APIRequest.server(q);
        const responseText = await response.text();

        // parse Stripe payment URL.
        const url = responseText.split("url:")[1].split('"}}')[0];
        const responseData = JSON.parse(responseText);

        // return Stripe url to dashboard.
        return url;
    }
    // method to get user profile
    static async getProfile() {
        // prepare graphql call
        const q = "query {profile }";
        // make graphql call
        const response = await APIRequest.server(q);
        // get response
        const responseText = await response.text();
        const responseData = JSON.parse(responseText);
        // parse profile data into JSON format
        const profile = JSON.parse(responseData.data.profile);
        //return profile to dashboard.
        return profile;
    }
    // get all donations for a user
    static async getDonations() {
        // prepare graphql call
        const q = "query {donations }";
        //make grapql call
        const response = await APIRequest.server(q, token);
        // get response
        const responseText = await response.text();
        //parse response
        const responseData = JSON.parse(responseText);
        // parse donations from response
        const donations = JSON.parse(responseData.data.donations)
        //return donations to dashboard.
        return donations;
    }
}

