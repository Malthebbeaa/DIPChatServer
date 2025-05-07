class User {
    #id;
    constructor(username, password, salt, dateCreated, id, userlevel) {
        this.username = username;
        this.password = password;
        this.salt = salt;
        this.dateCreated = dateCreated;
        this.#id = id;
        this.userlevel = userlevel;
    }

    getUserId() { return this.#id }
    static userToJSON(user) { return JSON.stringify(user) };
    static fromJSONToObject(json) { return JSON.parse(json) };
}

export { User }