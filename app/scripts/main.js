// Page did load
$(window).load(function() {

    // Variables
    const primaryColor = '#108FFF';
    const transitionValues = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

    // Animate body in
    const body = $('body');
    body.css('margin-top', 0);
    body.css('opacity', 1);

    // Transition completion listener
    // body.one(transitionValues, function(event) {
    //     body.css('background', primaryColor);
    // });

    const header = $('header');
    const headerImage = $('header .image');
    const headerTitles = $('header .titles');

    const animatedListItems = $('.animated-li').map(function() {
        return this;
    }).get();

    headerTitles.css('opacity', 1);
    headerImage.css('opacity', 1);

    header.addClass('shown');

    // const duration = listItemAtIndex.css('transition-duration');

    header.one(transitionValues, function(event) {
        header.unbind(transitionValues);

        // Set background color
        body.css('background', primaryColor);

        // Get specific animated list items
        const animatedListItems = $('li').map(function() {
            return this;
        }).get();

        // Loop list items in array
        for (i = 0; i < animatedListItems.length; i++) {

            // Item at index
            const listItemAtIndex = $(animatedListItems[i])
            const duration = Math.round(parseFloat(listItemAtIndex.css('transition-duration')) * 1000)

            // Delay items
            setTimeout(function() { 
                listItemAtIndex.css('opacity', 1);
                listItemAtIndex.css('margin-top', 0);
            }, (duration / 6) * i);
        }
    });
});