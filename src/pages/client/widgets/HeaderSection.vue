<template>

    <div id="app-header-banner">
        <div id="banner-background"></div>
        <div class="text-container">
            <h1><span>Real-time</span> Queue Management Solution</h1><br>
            <p>Say goodbye to chaos and long queues. WaitKue is an real-time virtual queue management platform that streamlines walk-ins, appointments, and service flow across web, kiosk, and mobile. From real-time dashboards to automated confirmations, WaitKue empowers businesses to serve faster, boost efficiency, and deliver outstanding customer experiences.</p>
            <VaButton class="mt-3" size="large" @click="scrollToServices">How it works?</VaButton>
        </div>
        <img :src="`mobile-mockups.png`" alt="">
    </div>

</template>
<style lang="scss">
#app-header-banner {
    background-image: url(background-banner.png);
    height: fit-content;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column; // Ensure vertical layout on all screens
    text-align: center;
    padding: 0 1rem; // Add horizontal padding for mobile

    img{
        width: 80%;
    }

    .text-container{
        width: 70%;
    }


    h1 {
        font-size: 5rem;
         line-height: 110%;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin-top: 4rem;
        span {
            color: #154EC1;
        }
    }

    p {
        font-size: 1.5rem;
         line-height: 150%;
        // font-style: italic;
    }

    // 📱 Responsive styles for small screens
    @media (max-width: 768px) {
        h1 {
            font-size: 2.5rem;
        }

        p {
            font-size: 1rem;
        }


    }

    @media (max-width: 480px) {
        h1 {
            font-size: 3rem;
            line-height: 100%;
        }

        p {
            font-size: 0.9rem;
        }

    }
}

#banner-background {
    background-image: url(background-banner.png);
    position: absolute;
    width: 100vw;
    margin: 0;
    padding: 0;
}

</style>
<script setup>
function scrollToServices() {
    const el = document.getElementById("services-section")
    if (el) {
        el.scrollIntoView({ behavior: "smooth" })
    }
}
</script>