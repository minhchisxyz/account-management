'use client'

import {useEffect, useRef, useState} from "react";
import {generateResponse} from "@/app/lib/gemini";
import DynamicTextArea from "@/components/dynamic-textarea";
import {Mic, MicOff} from "lucide-react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

interface Recorder {
  name: string
  start: () => void
  stop: () => void
  setLang: (lang: string) => void
}

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const [text, setText] = useState('')
  const [recognition, setRecognition] = useState<Recorder | null>(null)
  const [recorders, setRecorders] = useState<Map<string, Recorder>>(new Map())
  const router = useRouter()
  const transcriptRef = useRef('')
  const languages = [
    {
      label: 'Tiếng Việt',
      value: 'vi-VN'
    },
    {
      label: 'English',
      value: 'en-US'
    },
    {
      label: 'Deutsch',
      value: 'de-DE'
    }
  ]

  // Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      console.log('SpeechRecognition is supported')
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'vi-VN'

      recognitionInstance.onresult = (e: any) => {
        let currentTranscript = ''
        for (let i = 0; i < e.results.length; ++i) {
          currentTranscript += e.results[i][0].transcript
        }
        setText(currentTranscript)
        transcriptRef.current = currentTranscript
      }
      const webRecorder: Recorder = {
        name: 'Web Speech',
        start: () => {
          setIsRecording(true)
          setText('Recording...')
          recognitionInstance.start()
        },
        stop: async () => {
          recognitionInstance.stop()
          setIsRecording(false)
          const toastId = toast.loading('Processing...')
          const res = await generateResponse(transcriptRef.current)
          if (res) {
            toast.success('Processed successfully!', {id: toastId})
            router.replace(`/transactions?amount=${res.amount}&description=${res.description}&date=${res.date}`)
          }
        },
        setLang: (lang: string) => {
          recognitionInstance.lang = lang
        }
      }
      setRecorders(prev => new Map(prev).set('Web Speech', webRecorder))
    }
  }, [])

  // Gemini
  useEffect(() => {
    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true})
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, {type: 'audio/webm'})
        setText(`Processing...`)
        const toastId = toast.loading('Processing...')
        const res = await generateResponse(audioBlob)
        if (res) {
          toast.success('Processed successfully!', {id: toastId})
          router.replace(`/transactions?amount=${res.amount}&description=${res.description}&date=${res.date}`)
        }
      }

      recorder.start()
      mediaRecorder.current = recorder
      setIsRecording(true)
      setText('Recording...')
    }

    const stopRecording = async () => {
      mediaRecorder.current?.stop()
      setIsRecording(false)

    }

    const geminiRecorder: Recorder = {
      name: 'Gemini',
      start: startRecording,
      stop: stopRecording,
      setLang: () => {}
    }

    setRecorders(prev => new Map(prev).set('Gemini', geminiRecorder))
  }, []);

  const handleSelectChange = (e: string) => {
    const model = recorders.get(e)
    if (model) setRecognition(model)
  }

  return (
      <div className={`w-full flex flex-row gap-3 items-start justify-center`}>
        <DynamicTextArea text={text}/>
        <button
            type={`button`}
            disabled={!recognition}
            className={`rounded-full p-2 shadow-[4px_4px_8px_#dddddd,-4px_-4px_6px_#ffffff] hover:shadow-none hover:inset-shadow-[-4px_4px_8px_#dddddd,4px_-4px_6px_#ffffff] hover:cursor-pointer active:inset-shadow-[-4px_4px_8px_#dddddd,4px_-4px_6px_#ffffff]`}
            onClick={isRecording && recognition ? recognition?.stop : recognition?.start}
        >
          {isRecording ? <Mic/> : <MicOff/>}
        </button>
        <div className={`flex flex-col gap-2`}>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder={`Select model`}/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  recorders.size > 0 && Array.from(recorders.keys()).map(k => (
                      <SelectItem value={k} key={k}>{k}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
          { recognition?.name === 'Web Speech' && (
              <Select defaultValue={`vi-VN`} onValueChange={(lang) => recognition?.setLang(lang)}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select language`}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {
                        languages.map(lang => (
                            <SelectItem value={lang.value} key={lang.value}>{lang.label}</SelectItem>
                        ))
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
          )}
        </div>
      </div>
  )
}
