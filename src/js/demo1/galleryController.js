import { gsap } from 'gsap';
import { calcWinsize, getRandomInteger } from '../utils';
import GalleryItem from './galleryItem';
import LocomotiveScroll from 'locomotive-scroll';
import Splitting from "splitting";
import { auto } from '@popperjs/core';
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Call the splittingjs to transform the data-splitting texts to spans of chars 
Splitting();

// Initialize the Locomotive scroll
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true
});

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener('resize', () => winsize = calcWinsize());

export default class GalleryController {
    constructor(galleryEl) {
        this.DOM = {
            galleryEl: galleryEl,
            title: document.querySelector('.title'),
            gallery: document.querySelector('.gallery'),
            frame: document.querySelector('.frame'),
        };
        this.DOM.hero = document.querySelector('#hero');
        this.DOM.titleChars = this.DOM.title.querySelectorAll('.char');
        this.titleCharsTotal = this.DOM.titleChars.length;
        this.DOM.galleryItemElems = [...this.DOM.galleryEl.querySelectorAll('.gallery__item')];
        this.galleryItems = [];
        this.DOM.galleryItemElems.forEach(el => this.galleryItems.push(new GalleryItem(el)));
        this.itemsTotal = this.galleryItems.length;

        gsap.registerPlugin(ScrollTrigger);
        this.intro();
    }
    intro() {
        // create the timeline
        // let's start by animating the main intro text
        const timeline = gsap.timeline().to(this.DOM.title, {
            duration: 0,
            ease: 'expo',
            startAt: {y: '10%'},
            x: '0%',
            y: '25%',
            // scale: 1.2,
            opacity: 1
        }, 0);

        // now let's center the images (stack)
        for (const [pos, item] of this.galleryItems.entries()) {
            timeline.set(item.DOM.img, {
                x: winsize.width/2 - item.imgRect.left - item.imgRect.width/2,
                y:  winsize.height/2 - item.imgRect.top - item.imgRect.height/2,
                // scale: 0.85,
                // rotation: getRandomInteger(-10,10),
                opacity: 1,
                delay: 0.5*pos
            }, 0);

            // for the first image, we set a high scale for the inner image element
            // later we will animate this scale value together with the scale value of the outer image
            // if ( pos === 0 ) {
            //     timeline.set(item.DOM.imgInner, {
            //         scale: 1.8
            //     }, 0);
            // }
        }

        // access the first and other images in the stack
        const [firstImage, ...otherImages] = this.galleryItems.map(el => el.DOM.img);
        const galleryItem = document.querySelector('.gallery__item');
        const galleryItemImg = document.querySelector('.gallery__item-img');
        const galleryItemCaption = document.querySelector('.gallery__item-caption');
        const frame = document.querySelector('.frame');
        const hiddenElement = document.querySelector('.hidden-element');
        const heroImg = document.getElementById('#hero-image');
        const heroImgWrapper = document.getElementById('#hero-bg-wrapper');

        timeline
        .addLabel('startAnimation', '+=0')
        // allow scroll and update the locomotive scroll
        .add(() => {
            document.body.classList.remove('noscroll');
            scroll.update();
        }, 'startAnimation')
        
        // animate the main title characters out and fade them out too
        .to(this.DOM.titleChars, {
            duration: 1,
            ease: 'expo',
            display: 'none',
            // x: (pos, target) => {
            //     return -40*(Math.floor(this.titleCharsTotal/2)-pos);
            // },
            // y: -1500,
            // opacity: 0,
            // stagger: {from: 'center'}
        }, 'startAnimation')
        .set(firstImage, { maxWidth: '100%'})
        .set(galleryItemCaption, { display: 'none'})

        // the other images in the stack will animate its translation values randomly
        .to(otherImages, {
            duration: 0,
            ease: 'power1 out',
            // x: () => '+='+getRandomInteger(-200,200)+'%',
            // y: () => '+='+getRandomInteger(-200,200)+'%',
            opacity: 0,
            display: 'none',
            // rotation: () => getRandomInteger(-20,20)
        }, 'startAnimation')
        // and then we make them appear in their final position in the grid
        // .to(otherImages, {
        //     duration: 0,
        //     ease: 'expo',
        //     startAt: {
        //         x: 0,
        //         y: 0,
        //         rotation: 0,
        //         scale: 0.8
        //     },
        //     scale: 1,
        //     opacity: 0,
        //     display: 'none',
        // })



        // the first image will now animate to it's final position
        .to(firstImage, {
            duration: 2.5,
            ease: Power4.easeIn,
            // position: 'absolute',
            // top: '50%',
            x: 0,
            y:0,
            width: '100%',
            height: '100%',
            // scale: 5,
            rotation: 0,
            opacity: 0.6,

        }, 'startAnimation')
            // .to(firstImage, {
            //     duration: 4,
            //     ease: Sine.easeIn,
            //     x: 0,
            //     y: 0,
            //     // width: '100%',
            //     // height: '100%',
            //     // scale: 5,
            //     // rotation: 0,
            //     // opacity: 0.6,
            // }, 'startAnimation')


        .to(galleryItem, {
            position: 'absolute',
            display: 'flex',
            margin: 0,
            // duration: 6.2,
            ease: 'expo',
            // x: 0,
            // y: 0,
            width: '100vw',
            height: '100vh',
            // scale: 5,
            rotation: 0,
            opacity: 1
        }, 'startAnimation')
            .to(frame, {
                opacity: 1,
                duration: 2,
                ease: 'expo',
            }, 'startAnimation')
            .to(hiddenElement, {
                opacity: 1,
                duration: 5,
                ease: 'expo',
                zIndex: 999,
            }, 'startAnimation')
            // .set( fra)
        // both the image and inner image animate the scale value to achieve the "reveal effect"
        // .to(this.galleryItems[0].DOM.imgInner, {
        //     duration: 1.2,
        //     ease: 'expo',
        //     scale: 1
        // }, 'startAnimation');

            .to(heroImgWrapper, {
                scale: 0.5,
                scrollTrigger: {
                    // scroller: ,
                    trigger: heroImgWrapper,
                    start: 'top top',
                    scrub: true
                }
            }, 'startAnimation')

        // finally, animate the gallery item's content elements (title, number and texts)
        for (const [pos, item] of this.galleryItems.entries()) {
            timeline
            .add( () => item.inStack = false, 'startAnimation+=1' )
            .to(item.DOM.captionChars, {
                duration: 2,
                ease: 'expo',
                startAt: {
                    opacity: 0,
                    x: pos => -40*(Math.floor(item.captionCharsTotal/2)-pos)
                },
                x: 0,
                opacity: 0,
                stagger: {from: 'center'}
            }, 'startAnimation')
            .to([item.DOM.caption.number,item.DOM.caption.texts], {
                duration: 1,
                ease: 'power1',
                startAt: {opacity: 0},
                opacity: 0,
                stagger: 0.04,
                display: 'none',
            }, 'startAnimation+=0.3')
        }
    }
}