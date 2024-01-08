// import React, { useCallback, useEffect, useRef, useState } from 'react'
// // import { useAudioRecorder } from '@sarafhbk/react-audio-recorder'
// // import { getPresignedUrl, uploadToS3 } from 'utils/AWS_S3/s3Connection';
// import { ArrowRight, MicFill, StopFill, TrashFill } from 'react-bootstrap-icons';
// // import {  } from 'utils/package_config/toast';
// import moment from 'moment-timezone';
// import MicRecorder from 'mic-recorder-to-mp3';
// import { getPresignedUrl, uploadToS3 } from 'utils/AWS_S3/s3Connection';
// import { MuiTooltip } from 'Components/components';
// import { Button } from 'react-bootstrap';
// const audioRecorder = new MicRecorder({ bitRate: 128 });
// let isPermissionGranted = false;

// const defaultState = {
//     isUploading: false,
//     isRecording: false,
//     isBlocked: true,
//     file: null,
//     fileName: null,
//     blobData: null
// }
// export default function AudioFooter(props) {
//     const [state, setState] = useState(defaultState);
//     const { isUploading, isRecording, isBlocked, file, fileName } = state;
//     const recordBtn = useRef();

//     useEffect(() => {
//         setTimeout(() => {
//             !isBlocked &&
//                 recordBtn?.current?.click();
//         }, 1000);
//     }, [isBlocked]);

//     useEffect(() => {
//         navigator.getUserMedia = (
//             navigator.getUserMedia ||
//             navigator.webkitGetUserMedia ||
//             navigator.mozGetUserMedia ||
//             navigator.msGetUserMedia
//         );
//         if (navigator.mediaDevices) {
//             if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
//                 navigator.getUserMedia({
//                     audio: true, video: false
//                 }, (mic) => {
//                     isPermissionGranted = true;
//                     setState(prev => ({ ...prev, isBlocked: false }))
//                 }, () => setState(prev => ({ ...prev, isBlocked: true })));
//             } else {
//                 navigator.mediaDevices.getUserMedia({
//                     audio: true, video: false
//                 }).then((mic) => {
//                     isPermissionGranted = true;
//                     setState(prev => ({ ...prev, isBlocked: false }))
//                 }).catch(() => setState(prev => ({ ...prev, isBlocked: true })));
//             }
//         }
//     }, [isBlocked, isRecording]);

//     const getAudioPresignedurl = useCallback(async () => {
//         if (!file) return;
//         const res = await getPresignedUrl({ fileName: file.name, fileType: file.type });
//         return (res.data.url)
//     }, [file]);

//     const onSendAudioMessage = useCallback(async (e) => {
//         e.preventDefault();
//         setState(prev => ({ ...prev, isUploading: true }));
//         const presignedUrl = await getAudioPresignedurl(file);
//         if (presignedUrl) {
//             const uploadedAudioUrl = await uploadToS3(presignedUrl, file);
//             props.onSubmitAudio(file.type, fileName, uploadedAudioUrl);
//         }
//         setState(prev => ({ ...prev, ...defaultState }));
//         props.setRecorder(false);
//     }, [file, fileName, getAudioPresignedurl, props]);

//     const onStart = useCallback(() => {
//         if (isBlocked || !isPermissionGranted) alert("Permission Denied, Your Connection is not Secured!");
//         else audioRecorder.start().then(() => setState(prev => ({ ...defaultState, isBlocked: prev.isBlocked, isRecording: true }))).catch((e) => (e));
//     }, [isBlocked]);

//     const onStop = useCallback(() => {
//         audioRecorder
//             .stop()
//             .getMp3()
//             .then(([buffer, blob]) => {
//                 const blobUrl = URL.createObjectURL(blob);
//                 const d = new Date();
//                 const file = new File([blob], d.valueOf(), { type: "audio/mp3" })
//                 setState(prev => ({
//                     ...prev, isRecording: false, "file": file, blobData: blobUrl,
//                     fileName: `Audio-${moment().format("MM/DD/YY")}`,
//                 }));
//             }).catch((e) => ('We could not retrieve your message'));
//     }, []);

//     const onTransh = useCallback(() => {
//         if (isRecording) onStop();
//         props.setRecorder(false);
//         setState(defaultState)
//     }, [isRecording, props, onStop]);

//     return (<>
//         <div className={`preaudio-footer chat-footer d-flex flex-row align-items-center gap-5 ${props.type !== 'dictation' ? 'recording-footer' : ''}`}>
//             <MuiTooltip title='Delete'>
//                 <div className="btn p-4_8 audio_btn" role="button" onClick={onTransh}>
//                     <TrashFill size={20} />
//                 </div>
//             </MuiTooltip>
//             <MuiTooltip title={!isRecording ? "Start Recording" : "Listening audio..."}>
//                 <span>
//                     <Button variant='primary' onClick={onStart} disabled={isRecording} ref={recordBtn} size='sm'>
//                         {!isRecording ?
//                             <>
//                                 <MicFill fill='#fff' size={16} /> Record
//                             </> : 'Listening...'}
//                     </Button>
//                 </span>
//             </MuiTooltip>
//             {isRecording &&
//                 <MuiTooltip title='Stop Recording'>
//                     <Button variant='secondary' onClick={onStop} size='sm'>
//                         <StopFill fill="#ff337c" size={20} /> Stop
//                     </Button>
//                 </MuiTooltip>}
//             {state.blobData &&
//                 <audio controls id={'audio-' + state.blobData} className='audio-input' preload='metadata'>
//                     <source src={state.blobData} type="audio/ogg" />
//                     <source src={state.blobData} type="audio/mpeg" />
//                     Your browser does not support the audio element.
//                 </audio>}
//         </div>
//         {state.blobData && !isRecording &&
//             <div className="chat-footer recording-footer d-flex flex-row align-items-center">
//                 <form className="d-flex w-100" onSubmit={onSendAudioMessage}>
//                     <div className="input-group align-items-center">
//                         <input
//                             type="text"
//                             className={`form-control search ${props?.type === 'dictation' ? '' : 'mx-2 h-75'}`}
//                             value={fileName}
//                             placeholder="Filename"
//                             onChange={(e) =>
//                                 setState(prev => ({ ...prev, fileName: e.target.value }))
//                             } />
//                     </div>
//                     {file &&
//                         <button
//                             type="submit"
//                             className="btn btn-primary m-1 align-items-center audio_btn border-none"
//                             data-orientation="next"
//                             disabled={isUploading || isBlocked || !fileName}
//                         >
//                             {isUploading ? 'Sending...' : <ArrowRight size={20} fill="#fff" />}
//                         </button>}
//                 </form>
//             </div>}
//     </>);
// }