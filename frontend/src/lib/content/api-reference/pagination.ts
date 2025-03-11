import type {
	PaginationNextButtonPropsWithoutHTML,
	PaginationPagePropsWithoutHTML,
	PaginationPrevButtonPropsWithoutHTML,
	PaginationPropsWithoutHTML,
} from "bits-ui";
import { pageItemProp } from "./extended-types/index.js";
import { builderAndAttrsSlotProps, domElProps } from "./helpers.js";
import type { APISchema } from "$lib/types/index.js";
import * as C from "$lib/content/constants.js";

export const root: APISchema<PaginationPropsWithoutHTML> = {
	title: "Root",
	description: "The root pagination component which contains all other pagination components.",
	props: {
		count: {
			type: C.NUMBER,
			description: "The total number of items.",
			required: true,
		},
		perPage: {
			type: C.NUMBER,
			description: "The number of items per page.",
			default: "1",
		},
		siblingCount: {
			type: C.NUMBER,
			description: "The number of page triggers to show on either side of the current page.",
			default: "1",
		},
		page: {
			type: C.NUMBER,
			description:
				"The selected page. You can bind this to a variable to control the selected page from outside the component.",
		},
		onPageChange: {
			type: {
				type: C.FUNCTION,
				definition: "(page: number) => void",
			},
			description: "A function called when the selected page changes.",
		},
		...domElProps("HTMLDivElement"),
	},
};

export const page: APISchema<PaginationPagePropsWithoutHTML> = {
	title: "Page",
	description: "A button that triggers a page change.",
	props: {
		page: {
			type: pageItemProp,
			description: "The page item this component represents.",
		},
		...domElProps("HTMLButtonElement"),
	},
	slotProps: {
		...builderAndAttrsSlotProps,
	},
	dataAttributes: [
		{
			name: "selected",
			description: "Present on the current page element.",
		},
		{
			name: "pagination-page",
			description: "Present on the page trigger element.",
		},
	],
};

export const prevButton: APISchema<PaginationPrevButtonPropsWithoutHTML> = {
	title: "PrevButton",
	description: "The previous button of the pagination.",
	props: domElProps("HTMLButtonElement"),
	slotProps: {
		...builderAndAttrsSlotProps,
	},
	dataAttributes: [
		{
			name: "pagination-prev-button",
			description: "Present on the previous button element.",
		},
	],
};

export const nextButton: APISchema<PaginationNextButtonPropsWithoutHTML> = {
	title: "NextButton",
	description: "The next button of the pagination.",
	props: domElProps("HTMLButtonElement"),
	slotProps: {
		...builderAndAttrsSlotProps,
	},
	dataAttributes: [
		{
			name: "pagination-next-button",
			description: "Present on the next button element.",
		},
	],
};

export const pagination = [root, page, prevButton, nextButton];
