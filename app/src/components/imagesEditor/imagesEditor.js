import React from 'react'
import axios from 'axios'

export default class ImagesEditor {
    constructor(element, virtualElement, loaderShow, loaderHide, alertShow) {
        this.element = element;
        this.virtualElement = virtualElement;

        this.element.addEventListener("click", () => {this.onClick()})
        this.imgLoader = document.getElementById("img-upload")
        this.loaderShow = loaderShow
        this.loaderHide = loaderHide
        this.alertShow = alertShow
    }

    onClick(){
        this.imgLoader.click()
        this.imgLoader.addEventListener("change", () => {
            if(this.imgLoader.files && this.imgLoader.files[0]){
                let formData = new FormData()
                formData.append("image", this.imgLoader.files[0])
                this.loaderShow()
                axios.post('./api/uploadImage.php', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                    .then((res) => {
                        this.virtualElement.src = this.element.src = `./img/${res.data.src}`;
                        this.alertShow("success", "Success!", "Photo was changed")
                    })
                    .catch(() => {
                        this.alertShow("danger", "Error!", "Error while saving")
                    })
                    .finally(() => {
                        this.imgLoader.value = ""
                        this.loaderHide()
                    })
            }
        })
    }
}