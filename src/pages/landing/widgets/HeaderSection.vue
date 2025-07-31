<template>

    <div id="app-header-banner">
        <div id="banner-background"></div>
        <div class="text-container">
            <h1>
                <span class="tw"></span>
                Queue <br> Management Solution
            </h1><br>
            <p>No more chaos. With real-time screens, voice-powered calls, and easy ticketing, WaitKue transforms how
                businesses handle queues—fast, smart, and human-friendly.</p>
            <VaButton gradient round size="large" href="#steps-section">

                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V20M18 6L6 18M20 12H4M18 18L6 6" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                How it works 🤔 ?
            </VaButton>
        </div>
        <img class="hero-image" :src="`tv-mock.png`" alt="">
    </div>

</template>
<style lang="scss">
#app-header-banner {
    background-image: url(background-banner.png);
    background-size: cover;
    background-repeat: no-repeat;
    height: fit-content;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column; // Ensure vertical layout on all screens
    text-align: center;
    padding: 0 1rem; // Add horizontal padding for mobile
    
   

    .hero-image {
        @apply w-4/5 mx-auto mt-16;
        filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.1));
        transform: perspective(1000px) rotateX(10deg);
        transition: transform 0.5s ease;

        &:hover {
            transform: perspective(1000px) rotateX(0deg);
        }

         @media (max-width: 480px) {
            width: 100%;
            margin-top: 2rem;
         }
    }

    .text-container {
        width: 70%;
    }


    h1 {
        font-size: 5rem;
        line-height: 110%;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin-top: 4rem;
        margin-bottom: 0;
    }

    p {
        font-size: 1.5rem;
        line-height: 150%;
        margin-bottom: 2rem;
    }

    // 📱 Responsive styles for small screens
    @media (max-width: 768px) {
        h1 {
            font-size: 2.5rem;
        }

        p {
            font-size: 1rem;
        }

        .text-container {
            width: 80%;
        }


    }

    @media (max-width: 480px) {
        h1 {
            font-size: 2rem;
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
import { onMounted } from 'vue'
import Writer from 't-writer.js'

onMounted(() => {
    const target = document.querySelector('.tw')
    const writer = new Writer(target, {
        loop: true,
        typeColor: '#1a73e8',
        cursorColor: '#1a73e8',
    })

    const words = ["Smart", "Fast", "Reliable", "Real-time", "Seamless"]

   for (let i = 0; i < words.length; i++) {
    const word = words[i]
    writer
        .type(word)
        .rest(1000)
        .clear()
}

    writer.start()

})

</script>