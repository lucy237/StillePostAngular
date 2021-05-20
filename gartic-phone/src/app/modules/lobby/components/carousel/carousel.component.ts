import { Component, OnInit, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
    animations: [
        trigger('carouselAnimation', [
            transition('void => *', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
            transition('* => void', [animate('300ms', style({ opacity: 0 }))]),
        ]),
    ],
})
export class CarouselComponent implements OnInit {
    currentSlide = 0;

    public slides = [
        {
            description: 'Baby Yoda',
            src: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1600&q=80',
        },
        {
            description: 'Monkey',
            src: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1955&q=80',
        },
        {
            description: 'Alien Astronaut',
            src: 'https://images.unsplash.com/photo-1607335614551-3062bf90f30e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        },
        {
            description: 'Cat',
            src: 'https://images.unsplash.com/photo-1500259571355-332da5cb07aa?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDB8fGNhdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1100&q=60',
        },
        {
            description: 'Stone',
            src: 'https://images.unsplash.com/photo-1534584633196-6edac9eaff29?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=975&q=80',
        },
    ];

    constructor() {
        console.log('current slide: ', this.currentSlide);
    }

    onPreviousClick() {
        const previous = this.currentSlide - 1;
        this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
        console.log('previous clicked, new current slide is: ', this.currentSlide);
    }

    onNextClick() {
        const next = this.currentSlide + 1;
        this.currentSlide = next === this.slides.length ? 0 : next;
        console.log('next clicked, new current slide is: ', this.currentSlide);
    }

    ngOnInit(): void {
        this.preloadImages();
    }

    preloadImages() {
        for (const slide of this.slides) {
            new Image().src = slide.src;
        }
    }
}
