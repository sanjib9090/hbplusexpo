import React, { useState } from 'react';
import { ScrollView } from 'react-native';

// Don't allow drag/overscroll when content fits. Keep scrolling available when
// the keyboard, long content or larger accessibility text needs more space.
export default function AdaptiveScrollView({ children, onLayout, onContentSizeChange, ...props }) {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const scrollEnabled = !viewportHeight || !contentHeight || contentHeight > viewportHeight + 1;
  return <ScrollView {...props} overScrollMode="never" bounces={false} scrollEnabled={scrollEnabled}
    onLayout={event => { setViewportHeight(event.nativeEvent.layout.height); onLayout?.(event); }}
    onContentSizeChange={(width, height) => { setContentHeight(height); onContentSizeChange?.(width, height); }}>
    {children}
  </ScrollView>;
}
