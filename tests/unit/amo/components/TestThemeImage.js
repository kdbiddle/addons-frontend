import * as React from 'react';

import { ADDON_TYPE_EXTENSION, ADDON_TYPE_STATIC_THEME } from 'amo/constants';
import ThemeImage, { ThemeImageBase } from 'amo/components/ThemeImage';
import {
  createInternalAddonWithLang,
  fakeAddon,
  fakeI18n,
  fakePreview,
  fakeTheme,
  shallowUntilTarget,
} from 'tests/unit/helpers';

describe(__filename, () => {
  const render = (props = {}) => {
    return shallowUntilTarget(
      <ThemeImage i18n={fakeI18n()} {...props} />,
      ThemeImageBase,
    );
  };

  it('renders nothing when add-on is null', () => {
    const root = render({ addon: null });

    expect(root.find('.ThemeImage')).toHaveLength(0);
  });

  it('renders nothing when add-on is not a theme', () => {
    const root = render({
      addon: createInternalAddonWithLang({
        ...fakeAddon,
        type: ADDON_TYPE_EXTENSION,
      }),
    });

    expect(root.find('.ThemeImage')).toHaveLength(0);
  });

  it('renders a theme image when add-on is a static theme', () => {
    const addon = createInternalAddonWithLang({
      ...fakeTheme,
      type: ADDON_TYPE_STATIC_THEME,
    });
    const root = render({ addon });

    expect(root.find('.ThemeImage')).toHaveLength(1);
    expect(root.find('.ThemeImage-image')).toHaveLength(1);
    expect(root.find('.ThemeImage-image')).toHaveProp(
      'alt',
      `Preview of ${addon.name}`,
    );
    expect(root.find('.ThemeImage-image')).toHaveProp(
      'src',
      addon.previews[0].src,
    );
  });

  it('renders a theme image with rounded corners', () => {
    const addon = createInternalAddonWithLang({
      ...fakeTheme,
      type: ADDON_TYPE_STATIC_THEME,
    });
    const root = render({ addon, roundedCorners: true });

    expect(root.find('.ThemeImage')).toHaveLength(1);
    expect(root.find('.ThemeImage')).toHaveClassName(
      'ThemeImage--rounded-corners',
    );
  });

  it('displays a preview with 720 width', () => {
    const fullImage720 = `https://addons.mozilla.org/user-media/full/720.png`;
    const addon = createInternalAddonWithLang({
      ...fakeTheme,
      type: ADDON_TYPE_STATIC_THEME,
      previews: [
        {
          ...fakePreview,
          image_size: [600, 500],
        },
        {
          ...fakePreview,
          image_size: [720, 500],
          image_url: fullImage720,
        },
      ],
    });
    const root = render({ addon });

    expect(root.find('.ThemeImage-image')).toHaveProp('src', fullImage720);
  });
});
