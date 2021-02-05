'use strict';


const webinar = document.querySelectorAll('.webinars-section');

let webinarItem;

let clientWidth;


// Prototype for defining the last element NodeList
NodeList.prototype.last = function() {
    return this[this.length - 1];
};

if (document.body.clientWidth == 720) {
    showThreeBloсks();
}


window.addEventListener('resize', () => {
    clientWidth = document.body.clientWidth;

    showThreeBloсks(clientWidth); 

});


function showThreeBloсks(width = 720) {

    if (width > 720) { 
        webinar.forEach(item => {
            webinarItem = item.querySelectorAll('.webinars-section__item');
            webinarItem.forEach((item, index) => {
                            item.classList.remove('hide');
                        });
        });

    }
    if (width <= 720) {
        webinar.forEach(item => {
            webinarItem = item.querySelectorAll('.webinars-section__item');
            webinarItem.forEach((item, index) => {
                            (index > 2) ? item.classList.add('hide') : item.classList.remove('hide');
                        });
        });
    }

}

// Custom video block
function findVideos() {
    let videos = document.querySelectorAll('.video');

    for (let i = 0; i < videos.length; i++) {
        setupVideo(videos[i]);
    }
}

function setupVideo(video) {
    let link = video.querySelector('.video__link');
    let media = video.querySelector('.video__media');
    let button = video.querySelector('.video__btn');
    let id = parseMediaURL(media);

    video.addEventListener('click', () => {
        let iframe = createIframe(id);

        link.remove();
        button.remove();
        video.appendChild(iframe);
    });

    link.removeAttribute('href');
    video.classList.add('video--enabled');
}

function parseMediaURL(media) {
    let regexp = /https:\/\/i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]+)\/maxresdefault\.jpg/i;
    let url = media.src;
    let match = url.match(regexp);

    return match[1];
}

function createIframe(id) {
    let iframe = document.createElement('iframe');

    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'autoplay');
    iframe.setAttribute('src', generateURL(id));
    iframe.classList.add('video__media');

    return iframe;
}

function generateURL(id) {
    let query = '?rel=0&showinfo=0&autoplay=1';

    return 'https://www.youtube.com/embed/' + id + query;
}

findVideos();
