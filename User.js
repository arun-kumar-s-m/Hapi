class User{
    #username;
    #password;
    #fname;
    #lname;
    #email;
    #phone;
    constructor(obj){
        this.setUsername(obj.username);
        this.setPassword(obj.pwd);
        this.setFname(obj.fname);
        this.setLname(obj.lname);
        this.setEmail(obj.email);
        this.setPhone(obj.phone);
    }
    setUsername(name){
        this.#username = name;
    }
    getUsername(){
        return this.#username;
    }
    setPassword(pwd){
        this.#password = pwd;
    }
    getPassword(){
        return this.#password;
    }
    setFname(fname){
        this.#fname = fname;
    }
    getFname(){
        return this.#fname;
    }
    setLname(lanme){
        this.#lname = lanme;
    }
    getLname(){
        return this.#lname;
    }
    setEmail(email){
        this.#email = email;
    }
    getEmail(){
        return this.#email;
    }
    setPhone(phone){
        this.#phone = phone;
    }
    getPhone(){
        return this.#phone;
    }
}

module.exports = User;