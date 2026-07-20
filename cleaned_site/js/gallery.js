// Gallery JavaScript for Joseph Hurley Architects website

// Function to set the currently selected image
function setImg(id, state) {
    // State: 1 = normal, 2 = hover, 3 = clicked
    var imgElement = document.getElementById('img_' + id);
    if (!imgElement) return;
    
    if (state === 2) {
      // Hover state - highlight the thumbnail
      imgElement.style.opacity = '1.0';
      imgElement.style.border = '1px solid #666';
    } else if (state === 3) {
      // Clicked state - set as the main image
      imgElement.style.opacity = '1.0';
      imgElement.style.border = '1px solid #333';
      
      // Update main image if possible
      var slideshow = document.getElementById('slideshow');
      if (slideshow) {
        // Clear current content
        slideshow.innerHTML = '';
        
        // Create new image element
        var img = document.createElement('img');
        // Map thumbnail path -> full image. Replace the "_bw" variant first,
        // otherwise "thumb_project_image" matches inside "thumb_project_image_bw".
        img.src = imgElement.src.replace('thumb_project_image_bw', 'project_image')
                             .replace('thumb_project_image', 'project_image');
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        slideshow.appendChild(img);
      }
      
      // Mark all other thumbnails as not selected
      var thumbs = document.querySelectorAll('#thumbs ul.thumbs li img');
      for (var i = 0; i < thumbs.length; i++) {
        if (thumbs[i].id !== 'img_' + id) {
          thumbs[i].style.opacity = '0.7';
          thumbs[i].style.border = 'none';
        }
      }
    } else {
      // Normal state - unless this is the currently selected image
      var isSelected = imgElement.style.border === '1px solid #333';
      if (!isSelected) {
        imgElement.style.opacity = '0.7';
        imgElement.style.border = 'none';
      }
    }
  }
  
  // Function to handle scrolling in the description box
  function onLoadScroller() {
    // Initialize the scrollbar if necessary elements exist
    var container = document.getElementById('Scrollbar-Container');
    var scroller = document.getElementById('Scroller-1');
    
    if (container && scroller) {
      // Set up scroll buttons
      var upButton = container.querySelector('.Scrollbar-Up');
      var downButton = container.querySelector('.Scrollbar-Down');
      var scrollContent = scroller.querySelector('.Scroller-Container');
      
      if (upButton && downButton && scrollContent) {
        // Up button scrolls content up
        upButton.addEventListener('click', function() {
          scrollContent.style.top = Math.min(0, parseInt(scrollContent.style.top || 0) + 30) + 'px';
        });
        
        // Down button scrolls content down
        downButton.addEventListener('click', function() {
          var maxScroll = scroller.clientHeight - scrollContent.clientHeight;
          scrollContent.style.top = Math.max(maxScroll, parseInt(scrollContent.style.top || 0) - 30) + 'px';
        });
      }
    }
    
    // Initialize gallery if it exists
    initGallery();
  }
  
  // Function to initialize the gallery
  function initGallery() {
    if (typeof jQuery !== 'undefined' && jQuery('#thumbs').length > 0) {
      // Gallery initialization happens through jQuery in the page
      console.log('Gallery initialized through jQuery');
    } else {
      // Simple non-jQuery fallback for the gallery
      var thumbs = document.querySelectorAll('#thumbs ul.thumbs li img');
      
      // Set initial state - first image selected, others dimmed
      if (thumbs.length > 0) {
        thumbs[0].style.opacity = '1.0';
        thumbs[0].style.border = '1px solid #333';
        
        // Create initial main image if needed
        var slideshow = document.getElementById('slideshow');
        if (slideshow && slideshow.innerHTML === '') {
          var mainImg = document.createElement('img');
          mainImg.src = thumbs[0].src.replace('thumb_project_image_bw', 'project_image')
                                 .replace('thumb_project_image', 'project_image');
          mainImg.style.maxWidth = '100%';
          mainImg.style.height = 'auto';
          slideshow.appendChild(mainImg);
        }
        
        // Set other images to dimmed
        for (var i = 1; i < thumbs.length; i++) {
          thumbs[i].style.opacity = '0.7';
          thumbs[i].style.border = 'none';
        }
      }
      
      // Add click handlers
      for (var i = 0; i < thumbs.length; i++) {
        (function(index) {
          thumbs[index].onclick = function(e) {
            e = e || window.event;
            if (e.preventDefault) e.preventDefault();
            var id = this.id.replace('img_', '');
            setImg(id, 3);
            return false; // don't follow the thumbnail's <a href> to the raw image
          };
          thumbs[index].onmouseover = function() {
            var id = this.id.replace('img_', '');
            setImg(id, 2);
          };
          thumbs[index].onmouseout = function() {
            var id = this.id.replace('img_', '');
            setImg(id, 1);
          };
        })(i);
      }
    }
  }
  
  // Initialize when the DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Initial setup when page loads
    onLoadScroller();
    
    // If there's a hash in the URL (e.g., #image2), try to select that image
    if (window.location.hash) {
      var hash = window.location.hash.substring(1);
      var imgElement = document.getElementById('img_' + hash);
      if (imgElement) {
        setImg(hash, 3);
      }
    }
  });