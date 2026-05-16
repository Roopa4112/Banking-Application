/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['knockout', 'ojs/ojfilmstrip', '../accUtils'], 
  function(ko, ojFilmStrip, accUtils) {

    function AboutViewModel() {
      // Called when View is inserted into the DOM
      this.connected = () => {
        accUtils.announce('About page loaded.', 'assertive');
        document.title = "About";
      };

      // Called when View is disconnected
      this.disconnected = () => {};

      // Called after transition/animation is complete
      this.transitionCompleted = () => {};

      // Observable array for leadership team
      this.leaders = ko.observableArray([
        {
          name: 'Shri S L Jain',
          title: 'Managing Director & CEO',
          bio: 'Leads strategic growth and digital transformation.'
        },
        {
          name: 'Shri Imran Amin Siddiqui',
          title: 'Executive Director',
          bio: 'Drives innovation across customer-centric services.'
        },
        {
          name: 'Shri Ashutosh Choudhury',
          title: 'Executive Director',
          bio: 'Ensures compliance and operational excellence.'
        }
      ]);

      // ✅ Filmstrip Images
      this.aboutImages = ko.observableArray([
        { src: 'css/images/bank4.png', alt: 'Indian Bank Main Office' },
        { src: 'css/images/bank5.png', alt: 'Digital Banking Facility' },
        { src: 'css/images/bank7.png', alt: 'Customer Support Center' }
      ]);
    }

    return AboutViewModel;
  }
);
