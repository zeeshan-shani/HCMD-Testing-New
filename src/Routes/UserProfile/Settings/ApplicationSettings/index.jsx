import React from 'react'
import PreviewMessage from 'Routes/UserProfile/Settings/ApplicationSettings/PreviewMessage'
import FontRange from 'Routes/UserProfile/Settings/ApplicationSettings/FontRange'
import ChatBackground from 'Routes/UserProfile/Settings/ApplicationSettings/ChatBackground'

export default function ApplicationSetting({ user }) {
    return (
        <div className="card mb-3">
            <div className="card-header">
                <h6 className="mb-1">Application Settings</h6>
                <p className="mb-0 text-muted small">Update application settings</p>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-12">
                        <h6 className='mb-1'>Preview Message</h6>
                        <PreviewMessage user={user} />
                    </div>
                    <div className="col-md-6 col-12">
                        <div className="form-group d-flex flex-column">
                            <FontRange />
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <ChatBackground user={user} />
                    </div>
                </div>
            </div>
        </div>
    )
}
