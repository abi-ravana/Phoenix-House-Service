
    
    // Levenshtein Distance Function: இரண்டு வார்த்தைகளுக்கு இடையே உள்ள எழுத்துப் பிழைகளின் எண்ணிக்கையைக் கணக்கிடுகிறது.
    function levenshteinDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        const costs = [];
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0) {
                    costs[j] = j;
                } else if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
            if (i > 0) {
                costs[s2.length] = lastValue;
            }
        }
        return costs[s2.length];
    }

    /**
     * Technician Cards-ஐ Service District மற்றும் பிழைகளைச் சரிபார்த்து வடிகட்டுகிறது.
     */
    function filterProducts() {
        var input, filter, productContainer, products, districtElement, districtName;
        
        // 1. தேடல் உள்ளீட்டைப் பெறுதல் மற்றும் சுத்தப்படுத்துதல்
        input = document.getElementById('mySearchBar');
        filter = input.value.trim().toUpperCase(); 
        
        // 2. Levenshtein Distance-க்கான அதிகபட்ச பிழை வரம்பை அமைத்தல்
        // (Max error threshold for approximate matching)
        // 0 = சரியான பொருத்தம் (Exact match). 1-2 = சில பிழைகளை அனுமதிக்கும்.
        const MAX_DISTANCE = 1; 

        // 3. Product Container மற்றும் Product Cards-ஐப் பெறுதல்
        productContainer = document.getElementById('product-container-id'); 
        if (!productContainer) return; // container இல்லையெனில் செயல்பாட்டை நிறுத்து
        products = productContainer.getElementsByClassName('product'); 

        // 4. ஒவ்வொரு Product Card-ஐயும் சுழற்சி செய்தல்
        for (let i = 0; i < products.length; i++) {
            // Service District-ஐக் கொண்ட முதல் h3 டேகைப் பெறுக
            districtElement = products[i].getElementsByTagName('h3')[0]; 
            let shouldShow = false;

            if (districtElement) {
                // h3-ன் முழு எழுத்தையும் (e.g., "Service District - Jaffna") பெறுதல்
                let fullText = districtElement.textContent || districtElement.innerText;

                // "Service District - " என்ற பகுதியை நீக்கி, மாவட்டப் பெயரை மட்டும் பிரித்தெடுத்தல்
                districtName = fullText.replace("Service District -", "").trim().toUpperCase(); 
                
                // தேடல் வார்த்தை காலியாக இருந்தால், எல்லாவற்றையும் காட்டவும் (If search is empty, show all)
                if (filter === "") {
                    shouldShow = true;
                } 
                // இல்லையெனில், தேடலைச் சரிபார்க்கவும்
                else {
                    // தேடல் வார்த்தை அசல் பெயரில் இருக்கிறதா எனச் சரிபார்த்தல் (Simple Substring Match)
                    if (districtName.indexOf(filter) > -1) {
                         shouldShow = true;
                    } 
                    // Levenshtein Distance மூலம் பிழை சரிபார்ப்பு (Fuzzy Match for spelling mistakes)
                    else {
                        const distance = levenshteinDistance(filter, districtName);
                        // பிழைகளின் எண்ணிக்கை MAX_DISTANCE-ஐ விடக் குறைவாக இருந்தால் (அதாவது ஒத்துப்போனால்) காட்டவும்
                        if (distance <= MAX_DISTANCE) {
                            shouldShow = true;
                        }
                    }
                }
            }

            // 5. முடிவைக் காட்சிப்படுத்துதல்
            if (shouldShow) {
                products[i].style.display = ""; // காட்டு
            } else {
                products[i].style.display = "none"; // மறை
            }
        }
    }
