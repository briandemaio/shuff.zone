export interface Disc {
    color: 'YELLOW' | 'BLACK';
    blockYellow?: boolean;
    blockBlack?: boolean;
    // should be un-scaled position
    position: [number, number];
    index: number;
}