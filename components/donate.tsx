import React from 'react';

function DonateButton() {

    return (
        <div className='h-[615px] w-[500px] p-6'>
            <iframe
                src="https://givebutter.com/embed/c/gdseRO"
                width="100%"
                height="100%"
                style={{ maxWidth: '601px' }}
                name="givebutter"
                frameBorder="0"
                scrolling="yes"
                seamless
                // allowPaymentRequest
            />
            <script src="https://givebutter.com/js/widget.js"></script>
        </div>
    )
};

export default DonateButton;
