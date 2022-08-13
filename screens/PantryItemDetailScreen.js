import {
	View,
	Text,
	Button,
	StyleSheet
} from 'react-native';
import { useState } from 'react';

export default function ItemDetailScreen(args) {
	const { item } = args;

	const {
		name,
		quantity,
		price,
		loc,
		url,
		image,
		purBy,
		interval,
		history,
		notes
	} = item;
	const [ lastBought ] = history;
