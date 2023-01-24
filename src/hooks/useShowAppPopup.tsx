import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../contexts/overlay'
import { appOverlays, AppPopupId } from '../overlays/appOverlays'

export const useShowAppPopup = (id: AppPopupId) => {
  const [, updateOverlay] = useContext(OverlayContext)

  const showPopup = useCallback(() => {
    const Content = appOverlays[id].content

    updateOverlay({
      title: appOverlays[id].title,
      content: <Content />,
      visible: true,
      level: 'APP',
    })
  }, [id, updateOverlay])

  return showPopup
}
