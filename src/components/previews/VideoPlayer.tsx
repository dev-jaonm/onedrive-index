'use client'

import { useEffect } from 'react'
import Plyr from 'plyr-react'
import axios from 'axios'

import 'plyr-react/plyr.css'

interface VideoPlayerProps {
  videoName: string
  videoUrl: string
  width?: number
  height?: number
  thumbnail: string
  subtitle: string
  isFlv: boolean
  mpegts: any
}

const VideoPlayer = ({
  videoName,
  videoUrl,
  width,
  height,
  thumbnail,
  subtitle,
  isFlv,
  mpegts,
}: VideoPlayerProps) => {
  useEffect(() => {
    if (typeof window === 'undefined') return

    axios
      .get(subtitle, { responseType: 'blob' })
      .then(resp => {
        const track = document.querySelector('track')
        if (track) {
          track.setAttribute('src', URL.createObjectURL(resp.data))
        }
      })
      .catch(() => {
        console.log('Could not load subtitle.')
      })

    if (isFlv && mpegts) {
      const video = document.getElementById('plyr') as HTMLVideoElement | null
      if (video) {
        const flv = mpegts.createPlayer({ url: videoUrl, type: 'flv' })
        flv.attachMediaElement(video)
        flv.load()
      }
    }
  }, [videoUrl, isFlv, mpegts, subtitle])

  const plyrSource = {
    type: 'video',
    title: videoName,
    poster: thumbnail,
    tracks: [{ kind: 'captions', label: videoName, src: '', default: true }],
    ...(isFlv ? {} : { sources: [{ src: videoUrl }] }),
  }

  const plyrOptions: Plyr.Options = {
    ratio: `${width ?? 16}:${height ?? 9}`,
    fullscreen: { iosNative: true },
  }

  return <Plyr id="plyr" source={plyrSource as Plyr.SourceInfo} options={plyrOptions} />
}

export default VideoPlayer
