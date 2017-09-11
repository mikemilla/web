// Variables
var portfolio = [];
var isMobile = false;

// References
const transitionValues = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
const domInsertionValue = 'DOMNodeInserted';
const cssValue = 'stylechanged';
const backPressValue = 'popstate';
const videoType = 'video';

// Views
const view = $('html, body');
const body = $('body');

// Browsers
const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

// {
//     "slug": "huntwise-wind-interaction",
//     "media": {
//         "type": "video",
//         "thumbnail": "https://firebasestorage.googleapis.com/v0/b/portfolio-d6f40.appspot.com/o/images%2Fimage-huntwise.png?alt=media&token=dc7f065f-8233-4d91-89d8-3327936b5a6c",
//         "src": "https://firebasestorage.googleapis.com/v0/b/portfolio-d6f40.appspot.com/o/videos%2Fvideo-huntwise.mp4?alt=media&token=d2de6cb0-ce3b-4774-afe7-155372bebc82"
//     },
//     "title": "HuntWise Wind Particles",
//     "role": "Interaction Design + Android Development",
//     "description": "A subtle interaction to see wind and weather info for a user's hunting location. The particle effect uses wind speed and direction variables from the current selected time."
// },
// {
//     "slug": "huntwise-prediction-ui",
//     "media": {
//         "type": "photo",
//         "src": "https://firebasestorage.googleapis.com/v0/b/portfolio-d6f40.appspot.com/o/images%2Fimage-huntwise-2.png?alt=media&token=e384e991-99c7-4844-9609-86bcb05b7e84"
//     },
//     "title": "HuntWise Prediction UI",
//     "role": "Product Design",
//     "description": "An interface for hunters to see the best times to hunt. This design was based on metrics, testing, and feedback that resulted in a good balance of visuals and usablility."
// },
// {
//     "slug": "pesto-ui",
//     "media": {
//         "type": "photo",
//         "src": "https://firebasestorage.googleapis.com/v0/b/portfolio-d6f40.appspot.com/o/images%2Fimage-pesto.png?alt=media&token=603659b2-0727-4a19-99f3-75e17f404342"
//     },
//     "title": "Restaurant Menu UI",
//     "role": "Product Design",
//     "description": "An interface for a restaurant chain with blended ideas from real world menus and common app layouts."
// },
// {
//     "slug": "material-message",
//     "media": {
//         "type": "photo",
//         "src": "https://firebasestorage.googleapis.com/v0/b/portfolio-d6f40.appspot.com/o/images%2Fimage-message.gif?alt=media&token=ddaa692b-2664-449a-8f0e-03e6775d4d2b"
//     },
//     "title": "Material Message",
//     "role": "Interaction Design + Front-end Development",
//     "description": "An idea I had to transform a simple button into a larger interface.",
//     "url": "https://dribbble.com/shots/2061245-Material-Message",
//     "action": "See on Dribbble"
// },
// {
//     "slug": "wordnerd-gameplay",
//     "media": {
//         "type": "video",
//         "thumbnail": "https://firebasestorage.googleapis.com/v0/b/portfolio-d6f40.appspot.com/o/images%2Fimage-wordnerd.png?alt=media&token=ba791f48-6cde-41e3-9237-e044e4e4957c",
//         "src": "https://firebasestorage.googleapis.com/v0/b/portfolio-d6f40.appspot.com/o/videos%2Fvideo-wordnerd.mp4?alt=media&token=8f88c8a5-dacf-4f75-b8ea-754a43c74a0f"
//     },
//     "title": "Word Nerd",
//     "role": "Product Design + iOS & Android Development",
//     "description": "A game where you rhyme with as many words as possible! Like Flappy Bird for rhyming.",
//     "url": "http://mikemilla.com/wordnerd",
//     "action": "Install Word Nerd"
// },
// {
//     "slug": "simple-scale-interaction",
//     "media": {
//         "type": "video",
//         "thumbnail": "https://firebasestorage.googleapis.com/v0/b/portfolio-d6f40.appspot.com/o/images%2Fimage-simplescale.png?alt=media&token=ab4dfcf1-ea5e-4d2f-8f5a-1d3c3f148e3b",
//         "src": "https://firebasestorage.googleapis.com/v0/b/portfolio-d6f40.appspot.com/o/videos%2Fvideo-simplescale.mov?alt=media&token=7bed38c8-5009-4deb-9041-a8d1b04ceee0"
//     },
//     "title": "Simple Scale Walkthrough",
//     "role": "Product Design + iOS & Android Development",
//     "description": "A fun weight tracking app without any extra clutter. Supports 6 languages and has a mostly international user base.",
//     "url": "https://simplescale.thehuman.co/",
//     "action": "Install Simple Scale"
// },
// {
//     "slug": "coffeecram-interaction",
//     "media": {
//         "type": "video",
//         "thumbnail": "https://firebasestorage.googleapis.com/v0/b/portfolio-d6f40.appspot.com/o/images%2Fimage-coffeecram.png?alt=media&token=970a61ea-4801-4553-ab4c-ae7f1f7bc1c2",
//         "src": "https://firebasestorage.googleapis.com/v0/b/portfolio-d6f40.appspot.com/o/videos%2Fvideo-coffeecram.mov?alt=media&token=547375ff-0ac9-4498-963f-6657e4080cca"
//     },
//     "title": "CoffeeCram Onboarding",
//     "role": "iOS Development",
//     "description": "A subtle transition that links the user's touch position to a background opacity change."
// }