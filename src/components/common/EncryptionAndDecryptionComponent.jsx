import React, { Component } from 'react';
import $ from 'jquery';
import '../../Js/validation.js';
import 'jquery-validation';
import CryptoJS from 'crypto-js';

export default class EncryptionAndDecryptionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            encryptedText: '',
            decryptedText:''
        }
        this.dataChange = this.dataChange.bind(this);
        this.encrypt = this.encrypt.bind(this);
        this.decrypt = this.decrypt.bind(this);
    }

    render() {
        return (
            <div>
                JSON text to be encrypted<br /><br />
                <textarea id="jsonText" name="jsonText" onChange={this.dataChange} /><br></br><br></br>
                <button type="submit" onClick={this.encrypt}>Encrypt</button><br></br><br></br>
                Encrypted text is : {this.state.encryptedText}<br></br><br></br>
                <hr></hr>
                Encrpted text to be decrypted<br /><br />
                <textarea id="encyptedTextToBeDecrypted" name="encyptedTextToBeDecrypted" onChange={this.dataChange} /><br></br><br></br>
                <button type="submit" onClick={this.decrypt}>Decrypt</button><br></br><br></br>
                Decrypted text is : {this.state.decryptedText}

            </div>
        )
    }

    dataChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })

    }

    encrypt() {
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(this.state.jsonText), 'secret key 123');
        this.setState({
            encryptedText: ciphertext.toString()
        })
    }

    decrypt() {
        console.log('in decrypt');
        var bytes = CryptoJS.AES.decrypt(this.state.encyptedTextToBeDecrypted, 'secret key 123');
        var plaintext = bytes.toString(CryptoJS.enc.Utf8);

        this.setState({
            decryptedText: JSON.parse(plaintext)
        })

    }
}