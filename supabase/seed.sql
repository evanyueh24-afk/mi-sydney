-- ============================================================================
-- Mì Sydney — seed data (~33 real Sydney spots across all 5 categories).
-- Idempotent: re-running upserts spots and re-links collections.
-- Run AFTER 0001_init.sql.
-- hours_json keys: "0"=Sun .. "6"=Sat, each {open,close} 24h or null (closed).
-- Free outdoor spots use 00:00–23:59 to read as "always open".
-- ============================================================================

insert into public.spots
  (id, name, name_zh, category, subcategory, description, lat, lng, suburb, address,
   price_level, hours_json, phone, website, tags, hero_emoji, seed_rating, seed_rating_count)
values
-- ----------------------------- FOOD ---------------------------------------
('bennelong', 'Bennelong', '贝尼朗', 'food', 'Fine dining',
 'Peter Gilmore''s fine diner inside the sails of the Sydney Opera House, serving refined modern Australian food with a whimsical dessert menu drawing on traditional Aussie sweets.',
 -33.8568, 151.2153, 'Circular Quay', 'Sydney Opera House, Bennelong Point',
 3, '{"2":{"open":"17:30","close":"22:00"},"3":{"open":"17:30","close":"22:00"},"4":{"open":"17:30","close":"22:00"},"5":{"open":"17:30","close":"23:00"},"6":{"open":"12:00","close":"23:00"},"0":{"open":"12:00","close":"21:00"}}',
 '+61 2 9240 8000', 'https://www.bennelong.com.au', array['Fine dining','Australian','Harbour view'], '🦪', 4.6, 210),

('saintpeter', 'Saint Peter', '圣彼得', 'food', 'Seafood',
 'Josh Niland''s whole-fish seafood restaurant, celebrated worldwide for nose-to-tail fish cookery and a dining room devoted to sustainable seafood.',
 -33.8843, 151.2262, 'Paddington', 'Grand National Hotel, Paddington',
 3, '{"3":{"open":"18:00","close":"22:00"},"4":{"open":"18:00","close":"22:00"},"5":{"open":"12:00","close":"22:00"},"6":{"open":"12:00","close":"22:00"},"0":{"open":"12:00","close":"16:00"}}',
 '+61 2 8937 2530', 'https://saintpeter.com.au', array['Seafood','Fine dining','Chef-driven'], '🐟', 4.7, 180),

('goldencentury', 'Golden Century', '金唐酒家', 'food', 'Cantonese',
 'A Chinatown institution — live seafood tanks, steamed mud crab and late-night banquets that keep the CBD''s chefs coming back after their own shifts end.',
 -33.8779, 151.2035, 'Chinatown', '393-399 Sussex St, Haymarket',
 2, '{"0":{"open":"12:00","close":"02:00"},"1":{"open":"12:00","close":"02:00"},"2":{"open":"12:00","close":"02:00"},"3":{"open":"12:00","close":"02:00"},"4":{"open":"12:00","close":"04:00"},"5":{"open":"12:00","close":"04:00"},"6":{"open":"12:00","close":"04:00"}}',
 '+61 2 9212 3901', 'https://goldencentury.com.au', array['Cantonese','Seafood','Late night'], '🦞', 4.4, 640),

('chatthai', 'Chat Thai', '泰式茶餐', 'food', 'Thai',
 'A Thaitown mainstay serving boat noodles, som tum and Thai iced tea — the anchor of Sydney''s Campbell Street Thai strip.',
 -33.8797, 151.2073, 'Haymarket', '20 Campbell St, Haymarket',
 1, '{"0":{"open":"10:00","close":"02:00"},"1":{"open":"10:00","close":"02:00"},"2":{"open":"10:00","close":"02:00"},"3":{"open":"10:00","close":"02:00"},"4":{"open":"10:00","close":"02:00"},"5":{"open":"10:00","close":"02:00"},"6":{"open":"10:00","close":"02:00"}}',
 '+61 2 9211 1808', 'https://chatthai.com.au', array['Thai','Casual','Thaitown'], '🌶️', 4.3, 520),

('bourkestreetbakery', 'Bourke Street Bakery', '波克街面包房', 'food', 'Bakery',
 'The sausage roll and ginger brûlée tart that launched a small empire — still baked fresh daily at the original Surry Hills shopfront.',
 -33.8886, 151.2140, 'Surry Hills', '633 Bourke St, Surry Hills',
 1, '{"0":{"open":"07:00","close":"17:00"},"1":{"open":"07:00","close":"17:00"},"2":{"open":"07:00","close":"17:00"},"3":{"open":"07:00","close":"17:00"},"4":{"open":"07:00","close":"17:00"},"5":{"open":"07:00","close":"17:00"},"6":{"open":"07:00","close":"17:00"}}',
 '+61 2 9699 1011', 'https://bourkestreetbakery.com.au', array['Bakery','Pastry','Breakfast'], '🥐', 4.5, 390),

('mrwong', 'Mr Wong', '黄先生', 'food', 'Chinese',
 'A soaring, plant-filled Cantonese dining room in a heritage laneway building — Peking duck, trolley-service dumplings and a lively bar.',
 -33.8645, 151.2078, 'CBD', '3 Bridge Ln, Sydney CBD',
 2, '{"0":{"open":"11:00","close":"22:00"},"1":{"open":"11:00","close":"23:00"},"2":{"open":"11:00","close":"23:00"},"3":{"open":"11:00","close":"23:00"},"4":{"open":"11:00","close":"23:00"},"5":{"open":"11:00","close":"24:00"},"6":{"open":"11:00","close":"24:00"}}',
 '+61 2 9114 7317', 'https://merivale.com/venues/mrwong', array['Chinese','Yum cha','Buzzy'], '🥟', 4.4, 710),

-- -------------------------- ATTRACTIONS -----------------------------------
('operahouse', 'Sydney Opera House', '悉尼歌剧院', 'attractions', 'Landmark',
 'Jørn Utzon''s sail-roofed masterpiece on Bennelong Point — take a guided architecture tour or catch a performance inside.',
 -33.8568, 151.2153, 'Circular Quay', 'Bennelong Point, Sydney',
 0, '{"0":{"open":"09:00","close":"20:00"},"1":{"open":"09:00","close":"20:00"},"2":{"open":"09:00","close":"20:00"},"3":{"open":"09:00","close":"20:00"},"4":{"open":"09:00","close":"20:00"},"5":{"open":"09:00","close":"20:00"},"6":{"open":"09:00","close":"20:00"}}',
 '+61 2 9250 7111', 'https://www.sydneyoperahouse.com', array['Icon','Harbour','Tours'], '⛵', 4.8, 2400),

('harbourbridge', 'Sydney Harbour Bridge', '悉尼海港大桥', 'attractions', 'Landmark',
 'The ''Coathanger'' — walk the pedestrian lane for free, or book a BridgeClimb to the very top of the arch for 360° harbour views.',
 -33.8523, 151.2108, 'The Rocks', 'Sydney Harbour Bridge',
 0, '{"0":{"open":"00:00","close":"23:59"},"1":{"open":"00:00","close":"23:59"},"2":{"open":"00:00","close":"23:59"},"3":{"open":"00:00","close":"23:59"},"4":{"open":"00:00","close":"23:59"},"5":{"open":"00:00","close":"23:59"},"6":{"open":"00:00","close":"23:59"}}',
 null, 'https://www.bridgeclimb.com', array['Icon','BridgeClimb','Views'], '🌉', 4.8, 1900),

('bondibeach', 'Bondi Beach', '邦迪海滩', 'attractions', 'Beach',
 'Sydney''s most famous beach — surf, swim at the iconic Icebergs pool, or walk the coastal path to Coogee.',
 -33.8908, 151.2743, 'Bondi', 'Queen Elizabeth Dr, Bondi Beach',
 0, '{"0":{"open":"00:00","close":"23:59"},"1":{"open":"00:00","close":"23:59"},"2":{"open":"00:00","close":"23:59"},"3":{"open":"00:00","close":"23:59"},"4":{"open":"00:00","close":"23:59"},"5":{"open":"00:00","close":"23:59"},"6":{"open":"00:00","close":"23:59"}}',
 null, null, array['Beach','Surf','Coastal walk'], '🏖️', 4.6, 2100),

('taronga', 'Taronga Zoo', '塔龙加动物园', 'attractions', 'Zoo',
 'A harbourside zoo reached by ferry from Circular Quay, with sweeping views back over the water to the city skyline.',
 -33.8430, 151.2413, 'Mosman', 'Bradleys Head Rd, Mosman',
 2, '{"0":{"open":"09:30","close":"17:00"},"1":{"open":"09:30","close":"17:00"},"2":{"open":"09:30","close":"17:00"},"3":{"open":"09:30","close":"17:00"},"4":{"open":"09:30","close":"17:00"},"5":{"open":"09:30","close":"17:00"},"6":{"open":"09:30","close":"17:00"}}',
 '+61 2 9969 2777', 'https://taronga.org.au', array['Zoo','Family','Ferry'], '🦁', 4.5, 980),

('botanicgarden', 'Royal Botanic Garden', '皇家植物园', 'attractions', 'Garden',
 'Sprawling harbourside gardens between the Opera House and the CBD — a favourite spot for a picnic or the walk out to Mrs Macquarie''s Chair.',
 -33.8642, 151.2166, 'CBD', 'Mrs Macquaries Rd, Sydney',
 0, '{"0":{"open":"07:00","close":"18:30"},"1":{"open":"07:00","close":"18:30"},"2":{"open":"07:00","close":"18:30"},"3":{"open":"07:00","close":"18:30"},"4":{"open":"07:00","close":"18:30"},"5":{"open":"07:00","close":"18:30"},"6":{"open":"07:00","close":"18:30"}}',
 '+61 2 9231 8111', 'https://www.rbgsyd.nsw.gov.au', array['Gardens','Free','Walk'], '🌿', 4.7, 1300),

('darlingharbour', 'Darling Harbour', '达令港', 'attractions', 'Waterfront',
 'A lively waterfront precinct with SEA LIFE Aquarium, restaurants, and regular fireworks over the water.',
 -33.8748, 151.2010, 'Darling Harbour', 'Darling Harbour, Sydney',
 0, '{"0":{"open":"00:00","close":"23:59"},"1":{"open":"00:00","close":"23:59"},"2":{"open":"00:00","close":"23:59"},"3":{"open":"00:00","close":"23:59"},"4":{"open":"00:00","close":"23:59"},"5":{"open":"00:00","close":"23:59"},"6":{"open":"00:00","close":"23:59"}}',
 null, 'https://www.darlingharbour.com', array['Waterfront','Family','Aquarium'], '🎡', 4.3, 1550),

-- ------------------------- RECREATION -------------------------------------
('lunapark', 'Luna Park Sydney', '月神公园', 'recreation', 'Amusement park',
 'The heritage-listed harbourside amusement park under the Harbour Bridge — vintage rides, the giant laughing-face entrance and skyline views from the Ferris wheel.',
 -33.8484, 151.2110, 'Milsons Point', '1 Olympic Dr, Milsons Point',
 2, '{"5":{"open":"11:00","close":"22:00"},"6":{"open":"10:00","close":"22:00"},"0":{"open":"10:00","close":"18:00"},"1":{"open":"11:00","close":"18:00"},"4":{"open":"11:00","close":"22:00"}}',
 '+61 2 9922 6644', 'https://www.lunaparksydney.com', array['Rides','Harbour','Family','Night out'], '🎢', 4.4, 870),

('archiebrothers', 'Archie Brothers Cirque Electriq', '阿奇兄弟游乐场', 'recreation', 'Arcade & bar',
 'A carnival-themed arcade and cocktail playground — bumper cars, laser tag, hundreds of arcade games and boozy milkshakes. A go-to for group nights out.',
 -33.8929, 151.2249, 'Moore Park', 'Entertainment Quarter, 122 Lang Rd, Moore Park',
 2, '{"3":{"open":"12:00","close":"22:00"},"4":{"open":"12:00","close":"23:00"},"5":{"open":"12:00","close":"24:00"},"6":{"open":"10:00","close":"24:00"},"0":{"open":"10:00","close":"22:00"}}',
 '+61 1300 224 243', 'https://www.archiebrothers.com.au', array['Arcade','Bar','Group fun','Night out'], '🕹️', 4.3, 410),

('ninedegrees', '9 Degrees Bouldering', '九度攀岩馆', 'recreation', 'Rock climbing',
 'A big indoor bouldering gym with constantly re-set problems for every level, a training area and a café — one of the inner-city climbing scene''s hubs.',
 -33.9080, 151.1940, 'Alexandria', '11-13 Ashmore St, Alexandria',
 2, '{"1":{"open":"06:00","close":"22:00"},"2":{"open":"06:00","close":"22:00"},"3":{"open":"06:00","close":"22:00"},"4":{"open":"06:00","close":"22:00"},"5":{"open":"06:00","close":"22:00"},"6":{"open":"08:00","close":"18:00"},"0":{"open":"08:00","close":"18:00"}}',
 '+61 2 8386 8586', 'https://ninedegrees.com.au', array['Climbing','Bouldering','Active','Beginner friendly'], '🧗', 4.6, 320),

('letsgosurfing', 'Let''s Go Surfing', '冲浪课堂', 'recreation', 'Surf school',
 'Bondi''s long-running surf school — group lessons, board hire and coaching for first-timers right on the beach that made Australian surfing famous.',
 -33.8890, 151.2790, 'Bondi', '128 Ramsgate Ave, North Bondi',
 2, '{"0":{"open":"08:00","close":"18:00"},"1":{"open":"08:00","close":"18:00"},"2":{"open":"08:00","close":"18:00"},"3":{"open":"08:00","close":"18:00"},"4":{"open":"08:00","close":"18:00"},"5":{"open":"08:00","close":"18:00"},"6":{"open":"08:00","close":"18:00"}}',
 '+61 2 9365 1800', 'https://letsgosurfing.com.au', array['Surf','Lessons','Beach','Beginner friendly'], '🏄', 4.7, 540),

('strikebowling', 'Strike Bowling King St Wharf', '保龄球馆', 'recreation', 'Bowling',
 'Ten-pin bowling, laser tag, karaoke rooms and a cocktail bar right on the Darling Harbour waterfront — a reliable rainy-day or group-night option.',
 -33.8686, 151.2010, 'Darling Harbour', 'King St Wharf, 3 Lime St, Sydney',
 2, '{"1":{"open":"11:00","close":"23:00"},"2":{"open":"11:00","close":"23:00"},"3":{"open":"11:00","close":"23:00"},"4":{"open":"11:00","close":"24:00"},"5":{"open":"11:00","close":"01:00"},"6":{"open":"10:00","close":"01:00"},"0":{"open":"10:00","close":"23:00"}}',
 '+61 1300 787 453', 'https://strikebowling.com.au', array['Bowling','Karaoke','Bar','Group fun'], '🎳', 4.2, 280),

('paniqroom', 'PANIQ Room Sydney', '密室逃脱', 'recreation', 'Escape room',
 'City-centre escape rooms with cinematic sets — crack the puzzles and beat the clock with a small team. A staple of the new-experiences scene.',
 -33.8760, 151.2070, 'CBD', 'Level 2/377 Kent St, Sydney',
 2, '{"0":{"open":"10:00","close":"22:00"},"1":{"open":"12:00","close":"22:00"},"2":{"open":"12:00","close":"22:00"},"3":{"open":"12:00","close":"22:00"},"4":{"open":"12:00","close":"22:00"},"5":{"open":"10:00","close":"23:30"},"6":{"open":"10:00","close":"23:30"}}',
 null, 'https://sydney.paniqroom.com', array['Escape room','Puzzles','Group fun','Indoor'], '🔓', 4.5, 360),

('manlykayak', 'Manly Kayak Centre', '曼利皮划艇', 'recreation', 'Kayaking',
 'Guided harbour kayak tours and hire from Manly Cove — paddle out to quiet beaches and coves on Sydney''s sheltered northern harbour.',
 -33.7995, 151.2830, 'Manly', 'Manly Cove, East Esplanade, Manly',
 2, '{"0":{"open":"08:00","close":"17:00"},"1":{"open":"08:00","close":"17:00"},"2":{"open":"08:00","close":"17:00"},"3":{"open":"08:00","close":"17:00"},"4":{"open":"08:00","close":"17:00"},"5":{"open":"08:00","close":"17:00"},"6":{"open":"08:00","close":"17:00"}}',
 null, null, array['Kayaking','Harbour','Active','Outdoors'], '🛶', 4.6, 190),

('bonditocoogee', 'Bondi to Coogee Coastal Walk', '海岸步道', 'recreation', 'Coastal walk',
 'A spectacular 6km cliff-top walk past Bondi, Tamarama, Bronte and Clovelly to Coogee — beaches, sea pools and the open Pacific the whole way. Free.',
 -33.8930, 151.2760, 'Bondi', 'Notts Ave, Bondi Beach (start)',
 0, '{"0":{"open":"00:00","close":"23:59"},"1":{"open":"00:00","close":"23:59"},"2":{"open":"00:00","close":"23:59"},"3":{"open":"00:00","close":"23:59"},"4":{"open":"00:00","close":"23:59"},"5":{"open":"00:00","close":"23:59"},"6":{"open":"00:00","close":"23:59"}}',
 null, null, array['Walk','Coastal','Free','Outdoors'], '🥾', 4.9, 1400),

('frankiespizza', 'Frankie''s Pizza', '弗兰基酒吧', 'recreation', 'Bar & live music',
 'A hidden CBD basement bar dressed as a 70s pizzeria — pizza by the slice, cheap drinks and free live rock most nights. Late, loud and beloved.',
 -33.8660, 151.2100, 'CBD', '50 Hunter St, Sydney',
 1, '{"1":{"open":"16:00","close":"03:00"},"2":{"open":"16:00","close":"03:00"},"3":{"open":"16:00","close":"03:00"},"4":{"open":"16:00","close":"03:00"},"5":{"open":"16:00","close":"03:00"},"6":{"open":"16:00","close":"03:00"}}',
 null, 'https://frankiespizzabytheslice.com', array['Bar','Live music','Late night','Pizza'], '🎸', 4.5, 620),

-- --------------------------- SHOPPING -------------------------------------
('qvb', 'Queen Victoria Building', '维多利亚女王大厦', 'shopping', 'Heritage mall',
 'A magnificently restored 1898 Romanesque building filled with boutiques, cafés and a hand-carved Royal Clock — a shopping trip that doubles as sightseeing.',
 -33.8717, 151.2067, 'CBD', '455 George St, Sydney',
 2, '{"0":{"open":"11:00","close":"17:00"},"1":{"open":"09:00","close":"18:00"},"2":{"open":"09:00","close":"18:00"},"3":{"open":"09:00","close":"18:00"},"4":{"open":"09:00","close":"21:00"},"5":{"open":"09:00","close":"18:00"},"6":{"open":"09:00","close":"18:00"}}',
 '+61 2 9265 6800', 'https://www.qvb.com.au', array['Heritage','Boutiques','CBD'], '🏰', 4.6, 860),

('pittstmall', 'Pitt Street Mall', '皮特街购物区', 'shopping', 'Shopping strip',
 'Sydney''s main pedestrian shopping strip, anchored by Westfield Sydney and flagship stores from local and international brands.',
 -33.8703, 151.2090, 'CBD', 'Pitt St, Sydney CBD',
 2, '{"0":{"open":"10:00","close":"18:00"},"1":{"open":"09:00","close":"18:00"},"2":{"open":"09:00","close":"18:00"},"3":{"open":"09:00","close":"18:00"},"4":{"open":"09:00","close":"21:00"},"5":{"open":"09:00","close":"18:00"},"6":{"open":"09:00","close":"18:00"}}',
 null, null, array['High street','Flagships'], '🛍️', 4.3, 640),

('westfieldsydney', 'Westfield Sydney', '悉尼西田', 'shopping', 'Mall',
 'A vertical mall beneath Sydney Tower with luxury flagships, a large dining level, and direct access to the Pitt Street Mall strip.',
 -33.8709, 151.2085, 'CBD', '188 Pitt St, Sydney',
 2, '{"0":{"open":"10:00","close":"18:00"},"1":{"open":"09:30","close":"18:30"},"2":{"open":"09:30","close":"18:30"},"3":{"open":"09:30","close":"18:30"},"4":{"open":"09:30","close":"21:00"},"5":{"open":"09:30","close":"18:30"},"6":{"open":"09:30","close":"18:30"}}',
 '+61 2 8236 9200', 'https://www.westfield.com.au/sydney', array['Mall','Dining','Luxury'], '🏬', 4.4, 1100),

('paddysmarket', 'Paddy''s Markets', '派迪市场', 'shopping', 'Market',
 'A sprawling indoor market on the edge of Chinatown for produce, souvenirs, flowers and bargain finds since 1834.',
 -33.8809, 151.2030, 'Haymarket', '9-13 Hay St, Haymarket',
 1, '{"3":{"open":"10:00","close":"18:00"},"4":{"open":"10:00","close":"18:00"},"5":{"open":"10:00","close":"18:00"},"6":{"open":"10:00","close":"18:00"},"0":{"open":"10:00","close":"18:00"}}',
 null, 'https://paddysmarkets.com.au', array['Markets','Bargains','Chinatown'], '🧺', 4.0, 520),

('therocksmarket', 'The Rocks Markets', '岩石区市集', 'shopping', 'Weekend market',
 'Weekend stalls of local design, art and street food under the Harbour Bridge approach in Sydney''s oldest quarter.',
 -33.8599, 151.2089, 'The Rocks', 'George St, The Rocks',
 2, '{"6":{"open":"10:00","close":"17:00"},"0":{"open":"10:00","close":"17:00"}}',
 null, 'https://www.therocks.com', array['Weekend','Craft','Harbourside'], '🎨', 4.3, 410),

('paddingtonmarket', 'Paddington Markets', '帕丁顿市集', 'shopping', 'Weekend market',
 'A Saturday institution since 1973 — emerging designers, vintage racks and jewellery stalls in a leafy churchyard on Oxford Street.',
 -33.8847, 151.2265, 'Paddington', '395 Oxford St, Paddington',
 2, '{"6":{"open":"10:00","close":"16:00"}}',
 null, 'https://www.paddingtonmarkets.com.au', array['Saturday only','Fashion','Indie'], '👗', 4.4, 360),

-- --------------------------- SERVICES -------------------------------------
('chinatownmassage', 'Chinatown Foot Massage House', '唐人街足浴', 'services', 'Massage',
 'A typical Dixon Street foot & body massage studio; walk-ins welcome, popular after a big Chinatown dinner.',
 -33.8790, 151.2044, 'Chinatown', 'Dixon St, Haymarket',
 1, '{"0":{"open":"10:00","close":"22:00"},"1":{"open":"10:00","close":"22:00"},"2":{"open":"10:00","close":"22:00"},"3":{"open":"10:00","close":"22:00"},"4":{"open":"10:00","close":"22:00"},"5":{"open":"10:00","close":"23:00"},"6":{"open":"10:00","close":"23:00"}}',
 null, null, array['Massage','Walk-in','Chinatown'], '💆', 4.2, 140),

('bondisurfservice', 'Bondi Surf School', '邦迪冲浪学校', 'services', 'Surf lessons',
 'Group surf lessons and board hire operating out of Bondi Beach every morning — gear and wetsuits included.',
 -33.8912, 151.2765, 'Bondi', 'Bondi Beach',
 2, '{"0":{"open":"07:00","close":"17:00"},"1":{"open":"07:00","close":"17:00"},"2":{"open":"07:00","close":"17:00"},"3":{"open":"07:00","close":"17:00"},"4":{"open":"07:00","close":"17:00"},"5":{"open":"07:00","close":"17:00"},"6":{"open":"07:00","close":"17:00"}}',
 null, null, array['Lessons','Beginner friendly'], '🏄', 4.6, 260),

('cbdhairstudio', 'CBD Hair Studio', '市中心发廊', 'services', 'Hair salon',
 'A representative hair studio tucked into Sydney''s CBD laneways — cut, colour and styling; booking ahead recommended.',
 -33.8688, 151.2070, 'CBD', 'George St, Sydney CBD',
 2, '{"1":{"open":"09:00","close":"18:00"},"2":{"open":"09:00","close":"18:00"},"3":{"open":"09:00","close":"18:00"},"4":{"open":"09:00","close":"20:00"},"5":{"open":"09:00","close":"18:00"},"6":{"open":"09:00","close":"16:00"}}',
 null, null, array['Hair','Colour','Book ahead'], '💇', 4.3, 190),

('manlybike', 'Manly Bike Hire', '曼利自行车租赁', 'services', 'Bike hire',
 'Bike hire near Manly''s Corso, handy for the coastal path to Shelly Beach and the Spit-to-Manly walk.',
 -33.7969, 151.2854, 'Manly', 'The Corso, Manly',
 1, '{"0":{"open":"09:00","close":"17:00"},"1":{"open":"09:00","close":"17:00"},"2":{"open":"09:00","close":"17:00"},"3":{"open":"09:00","close":"17:00"},"4":{"open":"09:00","close":"17:00"},"5":{"open":"09:00","close":"17:00"},"6":{"open":"09:00","close":"17:00"}}',
 null, null, array['Rental','Beachside'], '🚲', 4.4, 95),

('pyrmontyoga', 'Pyrmont Yoga Studio', '派蒙瑜伽馆', 'services', 'Yoga',
 'A boutique yoga studio serving the Pyrmont/Darling Harbour apartment crowd — drop-in classes across levels.',
 -33.8700, 151.1955, 'Pyrmont', 'Harris St, Pyrmont',
 2, '{"0":{"open":"07:00","close":"19:00"},"1":{"open":"06:00","close":"20:00"},"2":{"open":"06:00","close":"20:00"},"3":{"open":"06:00","close":"20:00"},"4":{"open":"06:00","close":"20:00"},"5":{"open":"06:00","close":"20:00"},"6":{"open":"07:00","close":"14:00"}}',
 null, null, array['Yoga','Drop-in classes'], '🧘', 4.5, 120),

('operatours', 'Sydney Opera House Guided Tours', '歌剧院导览', 'services', 'Guided tour',
 'Official front-of-house and backstage architecture tours of the Opera House — book ahead, tours run daily.',
 -33.8568, 151.2153, 'Circular Quay', 'Sydney Opera House',
 2, '{"0":{"open":"09:00","close":"17:00"},"1":{"open":"09:00","close":"17:00"},"2":{"open":"09:00","close":"17:00"},"3":{"open":"09:00","close":"17:00"},"4":{"open":"09:00","close":"17:00"},"5":{"open":"09:00","close":"17:00"},"6":{"open":"09:00","close":"17:00"}}',
 '+61 2 9250 7111', 'https://www.sydneyoperahouse.com/visit-us/tours-and-experiences', array['Guided tour','Booking required'], '🎟️', 4.7, 800)

on conflict (id) do update set
  name = excluded.name,
  name_zh = excluded.name_zh,
  category = excluded.category,
  subcategory = excluded.subcategory,
  description = excluded.description,
  lat = excluded.lat,
  lng = excluded.lng,
  suburb = excluded.suburb,
  address = excluded.address,
  price_level = excluded.price_level,
  hours_json = excluded.hours_json,
  phone = excluded.phone,
  website = excluded.website,
  tags = excluded.tags,
  hero_emoji = excluded.hero_emoji,
  seed_rating = excluded.seed_rating,
  seed_rating_count = excluded.seed_rating_count;

-- ============================================================================
-- Editorial collections (spec §5). Deterministic UUIDs so re-seeding is stable.
-- ============================================================================
insert into public.collections (id, title, title_zh, type, description, target_audience, sort_order, cover_image_url)
values
 ('00000000-0000-0000-0000-000000000001', 'Sydney Musts', '悉尼必打卡', 'editorial',
  'The icons you can''t skip — the harbour, the beaches, the landmarks that define the city.',
  array['tourist','local'], 1, null),
 ('00000000-0000-0000-0000-000000000002', 'Hidden Gems', '小众好去处', 'editorial',
  'The spots locals love that don''t show up on every tourist list.',
  array['local','young_adult'], 2, null),
 ('00000000-0000-0000-0000-000000000003', 'Free Things to Do', '免费好去处', 'editorial',
  'Great days out that cost nothing — walks, beaches, gardens and markets.',
  array['tourist','local'], 3, null),
 ('00000000-0000-0000-0000-000000000004', 'Best Weekend Recreation', '周末玩乐精选', 'editorial',
  'Where to actually *do* something this weekend — climbing, surfing, arcades and late-night music.',
  array['local','young_adult'], 4, null)
on conflict (id) do update set
  title = excluded.title, title_zh = excluded.title_zh,
  description = excluded.description, target_audience = excluded.target_audience,
  sort_order = excluded.sort_order;

insert into public.collection_items (collection_id, spot_id, sort_order) values
 ('00000000-0000-0000-0000-000000000001', 'operahouse', 1),
 ('00000000-0000-0000-0000-000000000001', 'harbourbridge', 2),
 ('00000000-0000-0000-0000-000000000001', 'bondibeach', 3),
 ('00000000-0000-0000-0000-000000000001', 'taronga', 4),
 ('00000000-0000-0000-0000-000000000001', 'goldencentury', 5),
 ('00000000-0000-0000-0000-000000000001', 'qvb', 6),

 ('00000000-0000-0000-0000-000000000002', 'frankiespizza', 1),
 ('00000000-0000-0000-0000-000000000002', 'bourkestreetbakery', 2),
 ('00000000-0000-0000-0000-000000000002', 'paddingtonmarket', 3),
 ('00000000-0000-0000-0000-000000000002', 'ninedegrees', 4),
 ('00000000-0000-0000-0000-000000000002', 'saintpeter', 5),

 ('00000000-0000-0000-0000-000000000003', 'bondibeach', 1),
 ('00000000-0000-0000-0000-000000000003', 'botanicgarden', 2),
 ('00000000-0000-0000-0000-000000000003', 'bonditocoogee', 3),
 ('00000000-0000-0000-0000-000000000003', 'harbourbridge', 4),
 ('00000000-0000-0000-0000-000000000003', 'therocksmarket', 5),

 ('00000000-0000-0000-0000-000000000004', 'letsgosurfing', 1),
 ('00000000-0000-0000-0000-000000000004', 'ninedegrees', 2),
 ('00000000-0000-0000-0000-000000000004', 'archiebrothers', 3),
 ('00000000-0000-0000-0000-000000000004', 'strikebowling', 4),
 ('00000000-0000-0000-0000-000000000004', 'frankiespizza', 5),
 ('00000000-0000-0000-0000-000000000004', 'lunapark', 6)
on conflict (collection_id, spot_id) do update set sort_order = excluded.sort_order;
