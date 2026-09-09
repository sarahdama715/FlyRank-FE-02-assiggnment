# AI-Assisted Development Workflow Comparison

## Overview

Week 2 compared two approaches for implementing a Settings Form for the Farm Activity Planner. Round 1 used a deliberately vague prompt: "Create a settings form with validation for my Farm Activity Planner." Round 2 used a detailed prompt containing file instructions, validation rules, accessibility requirements, responsive behavior, edge cases, and a verification checklist.

## Round 1: Vague Prompt

The vague prompt produced a functional and visually strong Settings Form with farm information, notification preferences, activity categories, contact information, validation, reset functionality, and local storage. The form was responsive and keyboard navigation worked.

However, the vague prompt left important product decisions to the AI. During manual testing, I identified that the form accepted a farm size of zero acres. This is not appropriate for the Farm Activity Planner because a farm should have a positive area. The notification and activity checkboxes were also pre-selected by default, even though the user had not chosen those preferences. These were AI assumptions that were not explicitly requested.

The latitude and longitude validation was useful: both coordinates could be left empty, but entering only one required the other.

## Round 2: Precise Prompt

The second round explicitly defined the expected behavior before implementation. It required farm size to be greater than zero, specified the coordinate ranges and pairing behavior, required notification and activity checkboxes to remain unchecked by default, and defined reset, accessibility, keyboard, and responsive requirements.

Round 2 successfully rejected zero and negative acreage, kept optional checkboxes unchecked by default, correctly handled coordinate edge cases, reset the form and messages, supported keyboard navigation, and worked at mobile widths without horizontal scrolling.

## Comparison

Round 2 required more planning and prompt-writing effort, but it reduced review and correction effort because important edge cases were specified before coding. Round 1 was faster to start but required more manual discovery and evaluation of AI assumptions. The most significant correctness improvement was changing farm size validation from allowing zero to requiring a value greater than zero. Accessibility and responsive requirements were also made explicit rather than being left to the AI's interpretation.

Overall, the precise prompt produced a more predictable implementation and made verification easier. The comparison shows that detailed requirements and explicit verification instructions reduce ambiguity and improve the reliability of AI-assisted development.