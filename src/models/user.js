class User {
    constructor(username, password, salt, dateCreated, id, userlevel) {
        this.username = username;
        this.password = password;
        this.salt = salt;
        this.dateCreated = dateCreated;
        this.id = id;
        this.userlevel = userlevel;
    }

    userToJSON() { return JSON.stringify(this) }
}

export { User }