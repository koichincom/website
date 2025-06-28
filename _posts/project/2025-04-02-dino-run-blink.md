---
layout: post
categories: project
title: "DAHCI: Dino Run Blink"
subtitle: Play Dino Run only with your Eye Blinks
date: 2025-04-02
hero_image: /images/marek-piwnicki-optimized.jpg
---
This is the first project of DAHCI (De Anza Human-Computer Interaction), where we do projects about HCI involving EEG, BCI, ML, and more, which I'm in charge of as president. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/aH-ho_wtZcI?si=CgdugHRHukbv3Wr6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

How this project works is pretty simple; it utilizes RMS (Root Mean Square) and threshold method to detect whether the user blinked or not in real-time, and if the blink is detected, the program virtually presses the space key to jump in Dino Run. 

What I've learned, especially through threshold calibration for each test participant, was the EEG level differs significantly depending on people. The best threshold value could be 40 for some people and even 800 for some people. If we use it in real life, it's better not to have calibration before starting to use it, so taking time with no blink to automatically adjust to the best threshold might be better. However, it'll be more useful to use ML or the derivative method, so we don't even need to use a threshold to detect.

You can check the source code from the GitHub link below
https://github.com/deanzahci/dino-run-blink