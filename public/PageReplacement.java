// Page replacement FIFO

import java.util.Scanner;
class PageTable {
 int frameNo;
 boolean valid;
 public PageTable() {
 this.frameNo = -1;
 this.valid = false;
 }
}
public class PageReplacement {
 public static boolean isPagePresent(PageTable[] PT, int page, int n) {
 return PT[page].valid;
 }
 public static void updatePageTable(PageTable[] PT, int page, int frNo, boolean status) {
 PT[page].valid = status;
 PT[page].frameNo = frNo;
 }
 public static void printFrameContents(int[] frame, int noOfFrames) {
 for (int i = 0; i < noOfFrames; i++)
 System.out.print(frame[i] + "\t");
 System.out.println("\tM");
 }
 public static void printFrameContentsH(int[] frame, int noOfFrames) {
 for (int i = 0; i < noOfFrames; i++)
 System.out.print(frame[i] + "\t");
 System.out.println("\tH");
 }
 public static void main(String[] args) {
 Scanner scanner = new Scanner(System.in);
 int n, noOfFrames, pageFault = 0, pageHits = 0, current = 0;
 boolean flag = false;
 System.out.println("\nEnter the no. of pages:\n");
 n = scanner.nextInt();
 int[] referenceString = new int[n];
 System.out.println("\nEnter the reference string (different page numbers):\n");
 for (int i = 0; i < n; i++) {
 referenceString[i] = scanner.nextInt();
 }
 System.out.println("\nEnter the no. of frames you want to give to the process:");
 noOfFrames = scanner.nextInt();
 int[] frame = new int[noOfFrames];
 for (int i = 0; i < noOfFrames; i++) {
 frame[i] = -1;
 }
 PageTable[] PT = new PageTable[50];
 for (int i = 0; i < 50; i++) {
 PT[i] = new PageTable();
 }
 System.out.println("\n The Contents inside the Frame array at different time: \n\n");
 for (int i = 0; i < noOfFrames; i++) {
 System.out.print("F" + i + "\t");
 }
 System.out.println("Hit(H) or Miss(M)\n\n");
 for (int i = 0; i < n; i++) {
 if (!isPagePresent(PT, referenceString[i], n)) {
 pageFault++;
 if (!flag && current < noOfFrames) {
 frame[current] = referenceString[i];
 printFrameContents(frame, noOfFrames);
 updatePageTable(PT, referenceString[i], current, true);
 current++;
 if (current == noOfFrames) {
 current = 0;
 flag = true;
 }
 } else {
 updatePageTable(PT, frame[current], -1, false);
 frame[current] = referenceString[i];
 printFrameContents(frame, noOfFrames);
 updatePageTable(PT, referenceString[i], current, true);
 current = (current + 1) % noOfFrames;
 }
 } else {
 printFrameContentsH(frame, noOfFrames);
 pageHits++;
 }
 }
 System.out.println("\nTotal No. of Page Faults = " + pageFault);
 System.out.println("Total No. of Page Hits = " + pageHits);
 System.out.println("\nPage Fault ratio = " + ((float) pageFault / n));
 System.out.println("Page Hit Ratio = " + ((float) pageHits / n));
 scanner.close();
 }
}
