import { showLikedSongsList, showSongList, convertSecondsToMinutes } from './utils.js'

let currentSong = new Audio()
let songs
let currFolder
let autoPlay = false

let fromQueue = false
let queueIndex = 0
let queue = []

let fromRecent = false
let recentlyPlayed = JSON.parse(localStorage.getItem("recently played")) || []

let likedSongs = JSON.parse(localStorage.getItem("liked songs")) || []

let autoPlayBtn = document.getElementById("autoPlayBtn")

const getSongs = async (folder) => {
    currFolder = folder
    let a = await fetch(`/${currFolder}`)
    let response = await a.text()
    let div = document.createElement('div')
    div.innerHTML = response
    let as = div.getElementsByTagName('a')

    songs = []
    for (let i = 0; i < as.length; i++) {
        let element = as[i]
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1])
        }
    }

    let songUL = document.querySelector('.songlist').getElementsByTagName('ul')[0]
    songUL.innerHTML = ""
    for (const songname of songs) {
        songUL.innerHTML +=
            `<li class="songItem flex-r justify-space">
                <div class="template flex-r">
                    <img src="SVGs/music.svg" alt="poster">
                    <div class="details flex-c">
                        <p>${songname.replaceAll("%20", " ").replaceAll(".mp3", "")}</p>
                        <p>artist</p>
                    </div>
                </div>
                <div class="playnow flex-r align-center pointer">
                    <div class="flex-r" style="gap: 5px">
                        <img id="plus" src="SVGs/plus.svg" alt="play">
                        <img src="SVGs/${likedSongs.includes(`/${currFolder}/${songname.replaceAll("%20", " ")}`) ? "dislike" : "like"}.svg">
                    </div>
                    <div style="gap: 10px" class = "playSong flex-r">
                        <p>Play</p>
                        <img src="SVGs/playbtn.svg" alt="play">
                    </div>
                </div>
            </li>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.children[1].children[1].addEventListener("click", () => {
            fromQueue = false
            playMusic(`/${currFolder}/` + e.getElementsByTagName('div')[0].children[1].children[0].innerHTML + ".mp3".trim())
        })
    })

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.children[1].children[0].children[0].addEventListener("click", () => {
            addQueue(`/${currFolder}/` + e.getElementsByTagName('div')[0].children[1].children[0].innerHTML + ".mp3".trim())
            e.children[1].children[0].children[0].src = "SVGs/tick.svg"
            setTimeout(() => {
                e.children[1].children[0].children[0].src = "SVGs/plus.svg"
            }, 500)
        })
    })

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.children[1].children[0].children[1].addEventListener("click", () => {
            e.children[1].children[0].children[1].src = "SVGs/disLike.svg"

            let track = `/${currFolder}/` + e.getElementsByTagName('div')[0].children[1].children[0].innerHTML + ".mp3".trim()
            if (!likedSongs.includes(track)) {
                likedSongs.push(track)
                localStorage.setItem("liked songs", JSON.stringify(likedSongs))
            }
        })
    })

    return songs
}

const getLikedSongs = () => {

    let likedUl = document.querySelector(".likedlist").getElementsByTagName('ul')[0]
    likedUl.innerHTML = ""
    for (const likedSong of likedSongs) {
        likedUl.innerHTML = likedUl.innerHTML +
            `<li class="likedItem flex-r justify-space">
                    <div class="template flex-r">
                        <img src="SVGs/music.svg" alt="poster">
                        <div class="details flex-c">
                            <p>${likedSong.replaceAll("%20", " ").replaceAll(".mp3", "").split("/")[3]}</p>
                            <p>artist</p>
                        </div>
                    </div>
                    <div class="playnow flex-r align-center pointer">
                        <div class="flex-r" style="gap: 5px">
                            <img id="plus" src="SVGs/plus.svg" alt="play">
                            <img src="SVGs/dislike.svg">
                        </div>
                        <div style="gap: 10px" class = "playSong flex-r">
                            <p>Play</p>
                            <img src="SVGs/playbtn.svg" alt="play">
                        </div>
                    </div>
                </li>`
    }

    Array.from(document.querySelector(".likedlist").getElementsByTagName("li")).forEach((e, index) => {
        e.children[1].children[1].addEventListener("click", () => {
            playMusic(likedSongs[index])
        })
    })

    Array.from(document.querySelector(".likedlist").getElementsByTagName("li")).forEach((e, index) => {
        e.children[1].children[0].children[0].addEventListener("click", () => {
            addQueue(likedSongs[index])
            e.children[1].children[0].children[0].src = "SVGs/tick.svg"
            setTimeout(() => {
                e.children[1].children[0].children[0].src = "SVGs/plus.svg"
            }, 500)
        })
    })

    Array.from(document.querySelector(".likedlist").getElementsByTagName("li")).forEach((e, index) => {
        e.children[1].children[0].children[1].addEventListener("click", () => {
            e.remove()

            for (let item of likedSongs) {
                let there = item.split("/")[3].includes(e.children[0].children[1].children[0].innerHTML + ".mp3")
                if (there) {
                    likedSongs = likedSongs.filter((i) => i !== item)
                    localStorage.setItem("liked songs", JSON.stringify(likedSongs))
                }
            }
        })
    })

}

const addQueue = (track) => {

    if (!queue.includes(track)) {
        queue.push(track)

        let queueList = document.querySelector(".queuelist").getElementsByTagName('ul')[0]
        queueList.innerHTML = ""
        for (const queueSong of queue) {
            queueList.innerHTML = queueList.innerHTML +
                `<li class="queueItem flex-r justify-space">
                        <div class="template flex-r">
                        <img src="SVGs/music.svg" alt="poster">
                        <div class="details flex-c">
                            <p>${queueSong.replaceAll("%20", " ").replaceAll(".mp3", "").split("/")[3]}</p>
                            <p>artist</p>
                        </div>
                    </div>
                    <div class="playnow flex-r align-center pointer">
                        <img id="minus" src="SVGs/minus.svg" alt="remove">
                        <div style="gap: 10px" class = "playSong flex-r">
                            <p>Play</p>
                            <img src="SVGs/playbtn.svg" alt="play">
                        </div>
                    </div>
                </li>`
        }
    }

    Array.from(document.querySelector(".queuelist").getElementsByTagName("li")).forEach((e, index) => {
        e.children[1].children[1].addEventListener("click", () => {
            queueIndex = index
            fromQueue = true
            playMusic()
            autoPlay = true
            let autoPlayBtn = document.getElementById("autoPlayBtn")
            autoPlayBtn.style.margin = "0px 0px 0px 20px"
            autoPlayBtn.src = "SVGs/playbtn.svg"
        })
    })

    Array.from(document.querySelector(".queuelist").getElementsByTagName("li")).forEach((e, index) => {
        e.children[1].children[0].addEventListener("click", () => {
            e.remove()
            valueToRemove = queue[index]
            queue = queue.filter(item => item !== valueToRemove)
        })
    })

}

const playMusic = (track) => {
    if (queue.length != 0 && fromQueue && !fromRecent) {
        currentSong.src = queue[queueIndex]
        track = queue[queueIndex]
    }
    else {
        currentSong.src = track
        queue.length = 0
        Array.from(document.querySelector(".queuelist").getElementsByTagName("li")).forEach((e) => {
            e.remove()
        })
    }

    currentSong.play()
    play.src = "SVGs/pause.svg"

    document.querySelector(".songinfo").innerHTML =
        `<p class="self-center inverted m-0 primary-font"> 
            ${decodeURI(track).replace(".mp3", "").split("/")[3]} 
        </p>`
    document.querySelector(".songtime").innerHTML =
        `<p class="self-center inverted m-0 primary-font">
            00:00 / 00:00
        </p>`

    let recentSong = decodeURI(track).replace(".mp3", "")
    if (!recentlyPlayed.includes(recentSong)) {
        recentlyPlayed.unshift(recentSong)
        if (recentlyPlayed.length > 4) {
            recentlyPlayed.pop()
        }
        localStorage.setItem("recently played", JSON.stringify(recentlyPlayed))
        displayRecentlyPlayed()
    }

}

const displayRecentlyPlayed = () => {

    let recentUL = document.querySelector(".recentlyPlayed")
    recentUL.innerHTML = ""
    for (const recent of recentlyPlayed) {
        recentUL.innerHTML +=
            `<li class="recentcard flex rounded">
                <div class="l1 flex-r">
                    <img src="SVGs/music.svg" alt="poster">
                    <div class="details flex-c">
                        <p class="inverted">${recent.replace(".mp3", "").split("/")[3]}</p>
                        <p class="inverted">artist</p>
                    </div>
                </div>
                <div class="playRecent r1 flex-r pointer">
                    <p id="playNow" class="inverted primary-font m-0">Play</p>
                    <img src="SVGs/playbtn.svg" alt="play">
                </div>
            </li>`
    }

    Array.from(recentUL.getElementsByTagName("li")).forEach((e, index) => {
        e.children[1].addEventListener("click", () => {
            fromRecent = true
            playMusic(recentlyPlayed[index] + ".mp3".trim())
        })
    })
}

const displayAlbums = async () => {
    let a = await fetch(`/songs/`)
    let response = await a.text()
    let div = document.createElement('div')
    div.innerHTML = response
    let anchor = div.getElementsByTagName('a')
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchor)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-1)
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json()
            cardContainer.innerHTML +=
                `<div data-folder="${folder}" class="card album"> 
                    <div class="albumImage">
                        <img class="poster" src="/songs/${folder}/cover.jpg" alt="">
                        <img class="playButton" src="SVGs/playbtn.svg" alt="playButton">
                    </div>
                    <h3 class="m-0">${response.title}</h3>
                    <p class="m-0">${response.description}</p>
                </div>`

        }
    }

    Array.from(document.getElementsByClassName('album')).forEach(e => {
        e.addEventListener("click", async item => {
            await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            document.querySelector(".left").style.left = "0"
            document.querySelector(".folderName").innerHTML = currFolder.split("/")[1].replaceAll("%20", " ")
            showSongList(true)
        })
    })

    Array.from(document.getElementsByClassName('card'))[0].addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
        document.querySelector(".folderName").innerHTML = "Liked songs"
        showLikedSongsList(true)
        getLikedSongs()
    })

}

displayAlbums()
displayRecentlyPlayed()

currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `<p class="self-center inverted m-0 primary-font">${convertSecondsToMinutes(currentSong.currentTime)} / ${convertSecondsToMinutes(currentSong.duration)}</p>`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    if (document.querySelector(".circle").style.left == "100%") {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        document.querySelector(".circle").style.left = "0%"
        play.src = "SVGs/play.svg"
        document.querySelector(".songtime").innerHTML = `<p class="self-center inverted m-0 primary-font"> 00:00 / 00:00 </p>`
        if (queue.length != 0 && queueIndex < queue.length - 1 && autoPlay) {
            queueIndex += 1
            playMusic()
        }
        if ((index < songs.length - 1) && (autoPlay)) {
            playMusic(`/${currFolder}/` + songs[index + 1])
            play.src = "SVGs/pause.svg"
        }

    }
})

document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    if (percent > 0) {
        document.querySelector(".circle").style.left = percent + "%"
    }
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
})

play.addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play()
        play.src = "SVGs/pause.svg"
    }
    else {
        currentSong.pause()
        play.src = "SVGs/play.svg"
    }
})

previous.addEventListener("click", () => {
    currentSong.pause()
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if (queue.length != 0 && queueIndex > 0) {
        queueIndex -= 1
        playMusic()
    }
    else if (index > 0) {
        playMusic(`/${currFolder}/` + songs[index - 1])
    }
})

next.addEventListener("click", () => {
    currentSong.pause()
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if (queue.length != 0 && queueIndex < queue.length - 1) {
        queueIndex += 1
        playMusic()
    }
    else if (index < songs.length - 1) {
        playMusic(`/${currFolder}/` + songs[index + 1])
    }
})

autoPlayBtn.addEventListener("click", () => {
    autoPlayBtn.toggleAttribute("checked")
    if (autoPlayBtn.hasAttribute("checked")) {
        autoPlay = true
        autoPlayBtn.style.margin = "0px 0px 0px 20px"
        autoPlayBtn.src = "SVGs/playbtn.svg"
    }
    else {
        autoPlay = false
        autoPlayBtn.style.margin = "0px 0px 20px 0px"
        autoPlayBtn.src = "SVGs/pausebtn.svg"
    }
})

document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", e => {
    currentSong.volume = parseInt(e.target.value) / 100
    if (currentSong.volume > 0) {
        document.querySelector(".volume>img").src = "SVGs/volume.svg"
    }
    if (currentSong.volume == 0) {
        document.querySelector(".volume>img").src = "SVGs/mute.svg"
    }
})

document.querySelector(".volume>img").addEventListener("click", e => {
    if (currentSong.volume > 0) {
        (e.target.src = "SVGs/mute.svg")
        currentSong.volume = 0
        document.querySelector(".volume>input").value = 0
    }
    else {
        (e.target.src = "SVGs/volume.svg")
        currentSong.volume = 0.1
        document.querySelector(".volume>input").value = "10"
    }
})
