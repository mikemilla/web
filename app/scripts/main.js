// Page did load
$(window).load(function() {

    // Variables
    const primaryColor = '#108FFF';
    const transitionValues = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

    // Elements
    const body = $('body');
    const header = $('header');
    const headerImage = $('header .image');
    const headerTitles = $('header .titles');

    // Perform animations
    body.css('margin-top', 0);
    body.css('opacity', 1);
    headerTitles.css('opacity', 1);
    headerImage.css('opacity', 1);
    header.addClass('shown');

    // Listen to header animation ending
    header.one(transitionValues, function(event) {
        header.unbind(transitionValues);

        // Set background color
        body.css('background', primaryColor);

        // Loop list items in array
        $('.grid ul li').each(function(index, element) {
            const listItemAtIndex = $(this)
            const duration = Math.round(parseFloat(listItemAtIndex.css('transition-duration')) * 1000)

            // Delay items
            setTimeout(function() { 
                listItemAtIndex.css('opacity', 1);
                listItemAtIndex.css('margin-top', 0);
            }, (duration / 6) * index);
        });
    });
});