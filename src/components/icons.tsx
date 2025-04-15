import { Svg, Path } from "react-native-svg"
import React from "react"
const MemoedSvg = React.memo(Svg)
interface IconProps {
  color?: string
  size?: number
}

export function PlayIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 5.14v14l11-7-11-7z" fill={color} />
    </MemoedSvg>
  )
}

export function PauseIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill={color} />
    </MemoedSvg>
  )
}

export function SaveIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6V6z"
        fill={color}
      />
    </MemoedSvg>
  )
}

export function TimerIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0012 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a8.994 8.994 0 007.03-14.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
        fill={color}
      />
    </MemoedSvg>
  )
}

export function DeleteIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"
        fill={color}
      />
    </MemoedSvg>
  )
}

export function GoogleIcon({ size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="#4285F4"
        d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
      />
    </MemoedSvg>
  )
}

export function BackIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill={color} />
    </MemoedSvg>
  )
}

export function CloudIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"
        fill={color}
      />
    </MemoedSvg>
  )
}

export function CloudOffIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z"
        fill={color}
      />
    </MemoedSvg>
  )
}

export function SunIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"
        fill={color}
      />
    </MemoedSvg>
  )
}

export function MoonIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"
        fill={color}
      />
    </MemoedSvg>
  )
}

export function LogOutIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
        fill={color}
      />
    </MemoedSvg>
  )
}

export function UserIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        fill={color}
      />
    </MemoedSvg>
  )
}

export function InfoIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
        fill={color}
      />
    </MemoedSvg>
  )
}

export function BellIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
        fill={color}
      />
    </MemoedSvg>
  )
}

export function StarIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={color} />
    </MemoedSvg>
  )
}

export function XIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        fill={color}
      />
    </MemoedSvg>
  )
}

export function ClockIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
        fill={color}
      />
    </MemoedSvg>
  )
}

// Adicionar novos ícones
export function LoopIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
        fill={color}
      />
    </MemoedSvg>
  )
}

export function DownloadIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill={color} />
    </MemoedSvg>
  )
}

export function UploadIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" fill={color} />
    </MemoedSvg>
  )
}

export function ShareIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
        fill={color}
      />
    </MemoedSvg>
  )
}

export function ListIcon({ color = "#000", size = 24 }: IconProps) {
  return (
    <MemoedSvg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V3H3v6zm4 8h14v-2H7v2zm0-4h14v-2H7v2zm0-8v6h14V3H7z" fill={color} />
    </MemoedSvg>
  )
}
