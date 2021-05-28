import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

    currentSlide = 0;
    avatarLink = this.slides[this.currentSlide].src;
    isLoading = true;

    @Output() avatarChanged: EventEmitter<string> = new EventEmitter();

    constructor() {}

    updateCurrentAvatar(): void {
        this.avatarLink = this.slides[this.currentSlide].src;
        this.avatarChanged.emit(this.avatarLink);
    }

    onPreviousClick(): void {
        const previous = this.currentSlide - 1;
        this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
        this.updateCurrentAvatar();
    }

    onNextClick(): void {
        const next = this.currentSlide + 1;
        this.currentSlide = next === this.slides.length ? 0 : next;
        this.updateCurrentAvatar();
    }

    ngOnInit(): void {
        this.preloadImages();
    }

    preloadImages(): void {
        for (const slide of this.slides) {
            new Image().src = slide.src;
        }
    }

    onLoad(): void {
        this.isLoading = false;
    }
}
