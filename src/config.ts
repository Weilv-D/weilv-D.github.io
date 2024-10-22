import type { PostHideElements } from '~/content/config';

export const Site = 'https://weilv.space';
export const SiteLanguage = 'zh';
export const SiteTitle = '未来回忆录';
export const SiteDescription = '我的时空褶皱';
export const FooterDescription = '给时光以生命';
export const PageSize = 15;

// socialPlatform => userName
// check components/Header.astro socialConfig for more info
export const Socials: Record<string, Record<string, string>> = {
	mail: { url: 'mailto:weilv@mail.com' },
	github: { url: 'https://github.com/Weilv-D' },
	wechat: { url: '' },
	qq: { url: '' },
};

// doc: https://giscus.app
// data-theme is auto changed between noborder_light / noborder_gray
export const GiscusConfig: Record<string, string> = {};

export type HideElements =
	| PostHideElements
	| 'logo'
	| 'search'
	| 'themeToggler'
	| 'siteDescription'
	| 'footerDescription';
// Always hide elements from site
export const Hide: HideElements[] = [];

export const DefaultAuthor = 'Weilv';
export const CopyrightYear = '2024';
