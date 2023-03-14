import DonateButton from '@/components/donate';
import { useEffect, useState } from 'react';
import { fetchAllData } from './api/blizzardAPI';
import BasicModal from '../components/modal/Modal';
import { Button } from '@mui/material';
import Fade from '@mui/material/Fade';


interface Props {
  data: Data;
}

interface Data {
  [endpoint: string]: any;
}

const Home = ({ data }: Props) => {
  const [members, setMembers] = useState<any>([]);
  const [ilvlSort, setilvlSort] = useState(false);
  const [nameSort, setNameSort] = useState(false);
  const [ioSort, setIOSort] = useState(false);
  const [classSort, setClassSort] = useState(false);
  const [sortBy, setSortBy] = useState<any>(null);
  const [oldSorted, setOldSorted] = useState<any>(null);
  const [classCounter, setClassCounter] = useState({
    Paladin: 0,
    Shaman: 0,
    Druid: 0,
    Mage: 0,
    Warlock: 0,
    Rogue: 0,
    Monk: 0,
    DeathKnight: 0,
    Priest: 0,
    Warrior: 0,
    Hunter: 0,
    DemonHunter: 0,
    Evoker: 0,
    Tanks: 0,
    Melee: 0,
    Ranged: 0,
    Healers: 0,
    Cloth: 0,
    Leather: 0,
    Mail: 0,
    Plate: 0
  })
  const [total, setTotal] = useState(Object.values(data.Roster).length);
  const [filter, setFilter] = useState<any>([]);
  const [rankFilter, setRankFilter] = useState(false);
  const [classFilter, setClassFilter] = useState(false);
  const [scoreFilter, setScoreFilter] = useState(false);
  const [roleFilter, setRoleFilter] = useState(false);
  const [tierFilter, setTierFilter] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showClass, setShowClass] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const [showIO, setShowIO] = useState(false);


  useEffect(()=> {
    const obj = {...classCounter}
    if (data) for (let each in data.Roster) {
      const c: string = data.Roster[each].character.key.character_class.name
      const toon: any = data.Roster[each].character.key
      if (handleRole(toon) === 'Healer') obj['Healers'] += 1
      if (handleRole(toon) === 'Melee') obj['Melee'] += 1
      if (handleRole(toon) === 'Tank') obj['Tanks'] += 1
      if (handleRole(toon) === 'Ranged') obj['Ranged'] += 1
      if (c === 'Paladin') {
        obj[c] += 1
        obj['Plate'] += 1
      }
      if (c === 'Shaman') {
        obj[c] += 1
        obj['Mail'] += 1
      }
      if (c === 'Druid') {
        obj[c] += 1
        obj['Leather'] += 1
      }
      if (c === 'Mage') {
        obj[c] += 1
        obj['Cloth'] += 1
      }
      if (c === 'Warlock') {
        obj[c] += 1
        obj['Cloth'] += 1
      }
      if (c === 'Rogue') {
        obj[c] += 1
        obj['Leather'] += 1
      }
      if (c === 'Monk') {
        obj[c] += 1
        obj['Leather'] += 1
      }
      if (c === 'Death Knight') {
        obj['DeathKnight'] += 1
        obj['Plate'] += 1
      }
    if (c === 'Priest') {
      obj[c] += 1
      obj['Cloth'] += 1
    }
    if (c === 'Warrior') {
      obj[c] += 1
      obj['Plate'] += 1
    }
    if (c === 'Hunter') {
      obj[c] += 1
      obj['Mail'] += 1
    }
    if (c === 'Demon Hunter') {
      obj['DemonHunter'] += 1
      obj['Leather'] += 1
    }
    if (c === 'Evoker') {
      obj[c] += 1
      obj['Mail'] += 1
    }
    setClassCounter(obj)
  }
  }, [])

  useEffect(() => {
    if (!data) return

    const arr: any = Object.values(data.Roster)
    arr.sort((a: any, b: any) => b.character.key.equipped_item_level - a.character.key.equipped_item_level)
    setMembers(arr);

    console.log('MEMBERS', data)
  }, [data]);

  useEffect(()=> {
    if (filter.length === 0) return
    if (filter[0] === 'Rank') {
      const arr = Object.values(data.Roster).filter((each: any) => each.rank.toString() === filter[1].toString())
      setMembers(arr)
    }
    if (filter[0] === 'Class') {
      const arr = Object.values(data.Roster).filter((each: any) => each.character.key.character_class.name === filter[1])
      setMembers(arr)
    }
    if (filter[0] === 'Score') {
      let arr;
      if (filter[1] === '2600') arr = Object.values(data.Roster).filter((each: any) => each.character.key.mythic_keystone_profile.current_mythic_rating && Number(each.character.key.mythic_keystone_profile.current_mythic_rating.rating.toFixed()) >= 2600)
      if (filter[1] === '2400') arr = Object.values(data.Roster).filter((each: any) => each.character.key.mythic_keystone_profile.current_mythic_rating && Number(each.character.key.mythic_keystone_profile.current_mythic_rating.rating.toFixed()) < 2600 && each.character.key.mythic_keystone_profile.current_mythic_rating.rating.toFixed() >= 2400)
      if (filter[1] === '2200') arr = Object.values(data.Roster).filter((each: any) => each.character.key.mythic_keystone_profile.current_mythic_rating && Number(each.character.key.mythic_keystone_profile.current_mythic_rating.rating.toFixed()) < 2400 && each.character.key.mythic_keystone_profile.current_mythic_rating.rating.toFixed() >= 2200)
      if (filter[1] === '2000') arr = Object.values(data.Roster).filter((each: any) => each.character.key.mythic_keystone_profile.current_mythic_rating && Number(each.character.key.mythic_keystone_profile.current_mythic_rating.rating.toFixed()) < 2200 && each.character.key.mythic_keystone_profile.current_mythic_rating.rating.toFixed() >= 2000)
      if (filter[1] === '1999') arr = Object.values(data.Roster).filter((each: any) => each.character.key.mythic_keystone_profile.current_mythic_rating && Number(each.character.key.mythic_keystone_profile.current_mythic_rating.rating.toFixed()) < 2000)
      setMembers(arr)
    }
    if (filter[0] === 'Role') {
      const arr = Object.values(data.Roster).filter((each: any) => handleRole(each.character.key) === filter[1])
      console.log('arr', arr)
      setMembers(arr)
    }
    if (filter[0] === 'Tier') {
      console.log(typeof filter[1], filter[1])
      if (filter[1] === '0') {
        const arr = Object.values(data.Roster).filter((member: any) => !member.character.key.equipment.equipped_item_sets)
        setMembers(arr)
      } else if (filter[1] === '<4') {
        const arr1 = Object.values(data.Roster).filter((member: any) => !member.character.key.equipment.equipped_item_sets)
        const arr2 = Object.values(data.Roster).filter((member: any) => member.character.key.equipment.equipped_item_sets && member.character.key.equipment.equipped_item_sets[0].display_string[member.character.key.equipment.equipped_item_sets[0].display_string.length - 4] < 4)
        const arr = [...arr1, ...arr2]
        setMembers(arr)
      } else {
        const arr = Object.values(data.Roster).filter((member: any) => member.character.key.equipment.equipped_item_sets && member.character.key.equipment.equipped_item_sets[0].display_string[member.character.key.equipment.equipped_item_sets[0].display_string.length - 4] === filter[1])
        setMembers(arr)
      }
    }
    if (filter[0] === 'Clear') {
      const arr: any = Object.values(data.Roster)
      arr.sort((a: any, b: any) => b.character.key.equipped_item_level - a.character.key.equipped_item_level)
      setFilter([]);
      setMembers(arr);
    }
    if (!sortBy) setilvlSort(true)
    setSortBy(oldSorted)

    setRankFilter(false)
    setClassFilter(false)
    setScoreFilter(false)
    setRoleFilter(false)
    setTierFilter(false)
  }, [filter])

  useEffect(()=>{
    if (!sortBy) return
    const arr: any = members
    if (ilvlSort && sortBy === 'ilvl') arr.sort((a: any, b: any) => b.character.key.equipped_item_level - a.character.key.equipped_item_level)
    if (!ilvlSort && sortBy === 'ilvl') arr.sort((a: any, b: any) => a.character.key.equipped_item_level - b.character.key.equipped_item_level)
    if (!nameSort && sortBy === 'name') arr.sort((a: any, b: any) => b.character.name.localeCompare(a.character.name))
    if (nameSort && sortBy === 'name') arr.sort((a: any, b: any) => a.character.name.localeCompare(b.character.name))
    if (ioSort && sortBy === 'io') {
      const noKeys = arr.filter((each: any) => each.character.key.mythic_keystone_profile.current_mythic_rating === undefined);
      const hasKeys = arr.filter((each: any) => each.character.key.mythic_keystone_profile.current_mythic_rating !== undefined);
      hasKeys.sort((a: any, b: any) => b.character.key.mythic_keystone_profile.current_mythic_rating.rating - a.character.key.mythic_keystone_profile.current_mythic_rating.rating);
      noKeys.forEach((each: any) => hasKeys.push(each));
      setMembers(hasKeys);
      setSortBy(null);
      return
    }
    if (!ioSort && sortBy === 'io') {
      const noKeys = arr.filter((each: any) => each.character.key.mythic_keystone_profile.current_mythic_rating === undefined);
      const hasKeys = arr.filter((each: any) => each.character.key.mythic_keystone_profile.current_mythic_rating !== undefined);
      hasKeys.sort((a: any, b: any) => a.character.key.mythic_keystone_profile.current_mythic_rating.rating - b.character.key.mythic_keystone_profile.current_mythic_rating.rating);
      noKeys.forEach((each: any) => hasKeys.push(each));
      setMembers(hasKeys);
      setSortBy(null);
      return
    }
    if (classSort && sortBy === 'class') arr.sort((a: any, b: any) => b.character.key.character_class.name.localeCompare(a.character.key.character_class.name))
    if (!classSort && sortBy === 'class') arr.sort((a: any, b: any) => a.character.key.character_class.name.localeCompare(b.character.key.character_class.name))

    setOldSorted(sortBy)
    setMembers(arr)
    setSortBy(null)
  }, [sortBy])

  const setClassColor = (c: string) => {
    if (c === 'Paladin') {
      return { color: '#F48CBA' }
    }
    if (c === 'Shaman') {
      return { color: '#0070DD' }
    }
    if (c === 'Druid') {
      return { color: '#FF7C0A' }
    }
    if (c === 'Mage') {
      return { color: '#3FC7EB' }
    }
    if (c === 'Warlock') {
      return { color: '#8788EE' }
    }
    if (c === 'Rogue') {
      return { color: '#FFF468' }
    }
    if (c === 'Monk') {
      return { color: '#00FF98' }
    }
    if (c === 'Death Knight') {
      return { color: '#C41E3A' }
    }
    if (c === 'Priest') {
      return { color: '#FFFFFF' }
    }
    if (c === 'Warrior') {
      return { color: '#C69B6D' }
    }
    if (c === 'Hunter') {
      return { color: '#AAD372' }
    }
    if (c === 'Demon Hunter') {
      return { color: '#A330C9' }
    }
    if (c === 'Evoker') {
      return { color: '#33937F' }
    }
  }

  const setiLevelColor = (lvl: number) => {
    if (lvl >= 415) return { color: '#FF7C0A' }
    if (lvl < 415 && lvl >= 402) return { color: '#A330C9' }
    if (lvl < 402 && lvl >= 390) return { color: '#0070DD' }
    if (lvl < 390 && lvl >= 375) return { color: '#33FF33' }
    if (lvl < 375) return { color: '#9D9D9D' }
  }

  const serGearColor = (gear: any) => {
    if (gear.length < 1) return
    const lvl = gear[0].level.value
    if (lvl >= 415) return { color: '#FF7C0A' }
    if (lvl < 415 && lvl >= 402) return { color: '#A330C9' }
    if (lvl < 402 && lvl >= 390) return { color: '#0070DD' }
    if (lvl < 390 && lvl >= 375) return { color: '#33FF33' }
    if (lvl < 375) return { color: '#9D9D9D' }
  }

  const setTierColor = (num: any) => {
    if (num == 5 ) return { color: '#FFF468' }
    if (num == 4 ) return { color: '#FF7C0A' }
    if (num < 4 && num >= 2) return { color: '#33FF33' }
    if (num == 1 ) return { color: '#FFFFFF' }
    if (num < 1 ) return { color: '#FFFFFF40' }

  }

  const setiIOColor = (info: any) => {
    if (!info) return
    const color = info.color
    const rgba = `rgba(${color.r}, ${color.g}, ${color.b})`;
    return { color: rgba };
  }

  const handleilvlSort = () => {
    setilvlSort(!ilvlSort)
    setSortBy('ilvl')
  }

  const handleNameSort = () => {
    setNameSort(!nameSort)
    setSortBy('name')
  }

  const handleIOSort = () => {
    setIOSort(!ioSort)
    setSortBy('io')
  }

  const handleClassSort = () => {
    setClassSort(!classSort)
    setSortBy('class')
  }

  const handleRole = (toon: any) => {
    const charClass = toon.character_class.name
    const spec = toon.active_spec.name

    if (charClass === 'Paladin') {
      if (spec === 'Retribution') return 'Melee'
      if (spec === 'Protection') return 'Tank'
      if (spec === 'Holy') return 'Healer'
    }
    if (charClass === 'Shaman') {
      if (spec === 'Restoration') return 'Healer'
      if (spec === 'Enhancement') return 'Melee'
      if (spec === 'Elemental') return 'Ranged'
    }
    if (charClass === 'Druid') {
      if (spec === 'Balance') return 'Ranged'
      if (spec === 'Feral') return 'Melee'
      if (spec === 'Restoration') return 'Healer'
      if (spec === 'Guardian') return 'Tank'
    }
    if (charClass === 'Mage') return 'Ranged'
    if (charClass === 'Warlock') return 'Ranged'
    if (charClass === 'Rogue') return 'Melee'
    if (charClass === 'Monk') {
      if (spec === 'Brewmaster') return 'Tank'
      if (spec === 'Mistweaver') return 'Healer'
      if (spec === 'Windwalker') return 'Melee'
    }
    if (charClass === 'Death Knight') {
      if (spec === 'Blood') {
        return 'Tank'
      } else {
        return 'Melee'
      }
    }
    if (charClass === 'Priest') {
      if (spec === 'Shadow') {
        return 'Ranged'
      } else {
        return 'Healer'
      }
    }
    if (charClass === 'Warrior') {
      if (spec === 'Protection') {
        return 'Tank'
      } else {
        return 'Melee'
      }
    }
    if (charClass === 'Hunter') return 'Ranged'
    if (charClass === 'Demon Hunter') {
      if (spec === 'Havoc') return 'Melee'
      if (spec === 'Vengeance') return 'Tank'
    }
    if (charClass === 'Evoker') {
      if (spec === 'Devastation') return 'Ranged'
      if (spec === 'Preservation') return 'Healer'
    }
  }

  const setRoleColor = (toon: any) => {
    if (handleRole(toon) === 'Healer') return { color: '#6d9c55' }
    if (handleRole(toon) === 'Melee') return { color: '#6d5555' }
    if (handleRole(toon) === 'Tank') return { color: '#4d7b9d' }
    if (handleRole(toon) === 'Ranged') return { color: '#bf935a' }
  }

  const filterIOJSX = () => {
   return Object.values(data.Roster)
      .map((member: any) => member.character.key.mythic_keystone_profile.current_mythic_rating && member.character.key.mythic_keystone_profile.current_mythic_rating.rating.toFixed())
      .filter((val, index, self) => self.indexOf(val) === index)
      .reduce((acc, val) => {
        if (val >= 2600 && !acc[2600]) {
          acc[2600] = val;
        } else if (val >= 2400 && val < 2600 && !acc[2400]) {
          acc[2400] = val;
        } else if (val >= 2200 && val < 2400 && !acc[2200]) {
          acc[2200] = val;
        } else if (val >= 2000 && val < 2200 && !acc[2000]) {
          acc[2000] = val;
        } else if (val < 2000 && !acc[1999]) {
          acc[1999] = val;
        }
        return acc
      }, {})
  }

  const handleFilterButton = (button: string) => {
    if (button === 'Rank') {
      setRankFilter(!rankFilter);
      setClassFilter(false);
      setScoreFilter(false);
      setRoleFilter(false);
      setTierFilter(false);
    }
    if (button === 'Class') {
      setClassFilter(!classFilter);
      setRankFilter(false);
      setScoreFilter(false);
      setRoleFilter(false);
      setTierFilter(false);
    }
    if (button === 'IO') {
      setScoreFilter(!scoreFilter);
      setRankFilter(false);
      setClassFilter(false);
      setRoleFilter(false);
      setTierFilter(false);
    }
    if (button === 'Role') {
      setRoleFilter(!roleFilter);
      setRankFilter(false);
      setClassFilter(false);
      setScoreFilter(false);
      setTierFilter(false);
    }
    if (button === 'Tier') {
      setTierFilter(!tierFilter);
      setRankFilter(false);
      setClassFilter(false);
      setScoreFilter(false);
      setRoleFilter(false);
    }


  }


  return (
    data ? <>
      {showModal && (
        <BasicModal
        body={<DonateButton />}
        setShowModal={setShowModal}
        showModal={showModal}
        />
      )}
      <div className='min-w-[1420px]'>
        <section className={`font-bold text-xl fixed top-0 left-0 w-full bg-[black] z-[70] h-[130px] flex flex-row items-start pt-[20px] pb-5 gap-4 break-words`}>

          <div className=''>
            <img src={'./horde.png'} className='h-14 absolute top-6'/>
            <text className='text-[#732435] text-6xl ml-14'>{data.Guild.name}</text>
          </div>

          <div className='flex flex-row items-center'>
            <section className='flex flex-col'>
              <text className='text-xs'>Tanks: {classCounter.Tanks}</text>
              <text className='text-xs'>Healers: {classCounter.Healers}</text>
              <text className='text-xs'>DPS: {classCounter.Melee + classCounter.Ranged}</text>
              <text className='text-xs'>(Ranged: {classCounter.Ranged}, Melee: {classCounter.Melee})</text>
            </section>
            <section className='flex flex-col ml-4'>
              <text className='text-xs'>Cloth: {classCounter.Cloth}</text>
              <text className='text-xs'>Leather: {classCounter.Leather}</text>
              <text className='text-xs'>Mail: {classCounter.Mail}</text>
              <text className='text-xs'>Plate: {classCounter.Plate}</text>
            </section>
            <section className='flex flex-col ml-4'>
              <text className='text-xs'>Total: {total}</text>
            </section>

            <section className='flex flex-col ml-[100px] min-w-[388px] bg-[#434343] rounded-lg p-2 relative'>
              <text className='w-full flex items-start justify-center text-[white] font-bold text-lg'>Filter Roster</text>
              <button className='bg-[white] hover:border-solid hover:bg-[#188d9350] h-6 text-[black] text-sm px-2 rounded-lg whitespace-nowrap absolute top-[6px] right-2' onClick={()=>setFilter(['Clear'])}>Clear Filters</button>
              <main className='flex flex-row gap-2'>
                <button className='bg-[#188d93] hover:border-solid hover:bg-[#188d9350] h-8 text-[black] px-2 rounded-lg whitespace-nowrap' onClick={()=>handleFilterButton('Rank')}>Rank</button>
                <button className='bg-[#188d93] hover:border-solid hover:bg-[#188d9350] h-8 text-[black] px-2 rounded-lg whitespace-nowrap' onClick={()=>handleFilterButton('Class')}>Class</button>
                <button className='bg-[#188d93] hover:border-solid hover:bg-[#188d9350] h-8 text-[black] px-2 rounded-lg whitespace-nowrap' onClick={()=>handleFilterButton('IO')}>IO Score</button>
                <button className='bg-[#188d93] hover:border-solid hover:bg-[#188d9350] h-8 text-[black] px-2 rounded-lg whitespace-nowrap' onClick={()=>handleFilterButton('Role')}>Role</button>
                <button className='bg-[#188d93] hover:border-solid hover:bg-[#188d9350] h-8 text-[black] px-2 rounded-lg whitespace-nowrap' onClick={()=>handleFilterButton('Tier')}>Tier</button>

                {rankFilter && (
                  <div className='absolute top-[80px] left-[15px] rounded-lg flex flex-col bg-[#434343] w-[50px]'>
                    {Object.values(data.Roster)
                      .map((member: any) => member.rank)
                      .filter((val, index, self) => self.indexOf(val) === index)
                      .sort()
                      .map((val, i, self) => (
                        <section
                          key={'Rank' + val}
                          className={`w-full flex items-center justify-center cursor-pointer p-2 hover:bg-[#ffffff60] ${i === 0 && 'rounded-t-lg'} ${i === self.length - 1 && 'rounded-b-lg'}`}
                          onClick={()=>setFilter(['Rank', val])}
                          >
                          {val}
                        </section>
                      ))
                    }
                  </div>
                )}
                {classFilter && (
                  <div className='absolute top-[80px] left-[55px] rounded-lg flex flex-col bg-[#434343]'>
                    {Object.values(data.Roster)
                      .map((member: any) => member.character.key.character_class.name)
                      .filter((val, index, self) => self.indexOf(val) === index)
                      .sort()
                      .map((val, i, self) => (
                        <section
                          key={'Class' + val}
                          className={`w-full text-sm flex items-center justify-center cursor-pointer hover:bg-[#ffffff60] p-2 ${i === 0 && 'rounded-t-lg'} ${i === self.length - 1 && 'rounded-b-lg'}`}
                          onClick={()=>setFilter(['Class', val])}
                          >
                          {val}
                        </section>
                      ))
                    }
                  </div>
                )}
                {scoreFilter && (
                  <div className='absolute top-[80px] left-[150px] rounded-lg flex flex-col bg-[#434343]'>
                    {Object.entries(filterIOJSX()).map(([key, val]: any, i) =>
                      key == 2600 && <section key={'Score' + 2600} className={`w-full text-sm flex items-center justify-center cursor-pointer hover:bg-[#ffffff60] p-2 ${i === 0 && 'rounded-b-lg'} ${i === self.length - 1 && 'rounded-t-lg'}`} onClick={()=>setFilter(['Score', key])}>2600 +</section> ||
                      key == 2400 && <section key={'Score' + 2400} className={`w-full text-sm flex items-center justify-center cursor-pointer hover:bg-[#ffffff60] p-2 ${i === 0 && 'rounded-b-lg'} ${i === self.length - 1 && 'rounded-t-lg'}`} onClick={()=>setFilter(['Score', key])}>2400 - 2599</section> ||
                      key == 2200 && <section key={'Score' + 2200} className={`w-full text-sm flex items-center justify-center cursor-pointer hover:bg-[#ffffff60] p-2 ${i === 0 && 'rounded-b-lg'} ${i === self.length - 1 && 'rounded-t-lg'}`} onClick={()=>setFilter(['Score', key])}>2200 - 2399</section> ||
                      key == 2000 && <section key={'Score' + 2000} className={`w-full text-sm flex items-center justify-center cursor-pointer hover:bg-[#ffffff60] p-2 ${i === 0 && 'rounded-b-lg'} ${i === self.length - 1 && 'rounded-t-lg'}`} onClick={()=>setFilter(['Score', key])}>2000 - 2199</section> ||
                      key == 1999 && <section key={'Score' + 1999} className={`w-full text-sm flex items-center justify-center cursor-pointer hover:bg-[#ffffff60] p-2 ${i === 0 && 'rounded-b-lg'} ${i === self.length - 1 && 'rounded-t-lg'}`} onClick={()=>setFilter(['Score', key])}>0 - 1999</section>
                    ).reverse()}
                </div>
                )}
                {roleFilter && (
                  <div className='absolute top-[80px] left-[248px] rounded-lg flex flex-col bg-[#434343]'>
                    {Object.values(data.Roster)
                      .map((member: any) => handleRole(member.character.key))
                      .filter((val, index, self) => self.indexOf(val) === index)
                      .sort()
                      .map((val, i, self) => (
                        <section
                          key={'Class' + val}
                          className={`w-full text-sm flex items-center justify-center cursor-pointer hover:bg-[#ffffff60] p-2 ${i === 0 && 'rounded-t-lg'} ${i === self.length - 1 && 'rounded-b-lg'}`}
                          onClick={()=>setFilter(['Role', val])}
                          >
                          {val}
                        </section>
                      ))
                    }
                  </div>
                )}
                {tierFilter && (
                  <div className='absolute top-[80px] left-[325px] rounded-lg flex flex-col bg-[#434343]'>
                    <section
                      className={`w-full text-sm flex items-center justify-center cursor-pointer hover:bg-[#ffffff60] p-2 rounded-t-lg min-w-[40px]`}
                      onClick={()=>setFilter(['Tier', '<4'])}
                      >
                      {`< 4`}
                    </section>
                    {Object.values(data.Roster)
                      .map((member: any) => member.character.key.equipment.equipped_item_sets ? member.character.key.equipment.equipped_item_sets[0].display_string[member.character.key.equipment.equipped_item_sets[0].display_string.length - 4] : '0')
                      .filter((val, index, self) => self.indexOf(val) === index)
                      .sort()
                      .map((val, i, self) => (
                        <section
                          key={'Class' + val}
                          className={`w-full text-sm flex items-center justify-center cursor-pointer hover:bg-[#ffffff60] p-2 ${i === self.length - 1 && 'rounded-b-lg'} min-w-[40px]`}
                          onClick={()=>setFilter(['Tier', val])}
                          >
                          {val}
                        </section>
                      ))
                    }
                  </div>
                )}
              </main>
            </section>

            <section className='ml-6 flex flex-col'>
              <text>Appreciate the Site?</text>
              <Button variant='contained' className='bg-[#003655]' onClick={()=>setShowModal(!showModal)}>Donate Here</Button>
            </section>
          </div>

        <div className='absolute left-40 top-[100px] flex flex-row gap-4 items-center'>

          <section className='flex flex-row items-center'>
            <img src='/deathKnight.png' className='h-6'/>
            <text style={setClassColor('Death Knight')}>
              {classCounter.DeathKnight}
            </text>
          </section>

          <section className='flex flex-row items-center'>
            <img src='/demonHunter.png' className='h-6'/>
            <text style={setClassColor('Demon Hunter')}>
              {classCounter.DemonHunter}
            </text>
          </section>

          <section className='flex flex-row items-center'>
            <img src='/druid.png' className='h-6'/>
            <text style={setClassColor('Druid')}>
              {classCounter.Druid}
            </text>
          </section>

          <section className='flex flex-row items-center'>
            <img src='/evoker.png' className='h-6'/>
            <text style={setClassColor('Evoker')}>
              {classCounter.Evoker}
            </text>
          </section>

          <section className='flex flex-row items-center'>
            <img src='/hunter.png' className='h-6'/>
            <text style={setClassColor('Hunter')}>
              {classCounter.Hunter}
            </text>
          </section>

          <section className='flex flex-row items-center'>
            <img src='/mage.png' className='h-6'/>
            <text style={setClassColor('Mage')}>
              {classCounter.Mage}
            </text>
          </section>

          <section className='flex flex-row items-center'>
            <img src='/monk.png' className='h-6'/>
            <text style={setClassColor('Monk')}>
              {classCounter.Monk}
            </text>
          </section>

          <section className='flex flex-row items-center'>
            <img src='/paladin.png' className='h-6'/>
            <text style={setClassColor('Paladin')}>
              {classCounter.Paladin}
            </text>
          </section>

          <section className='flex flex-row items-center'>
            <img src='/priest.png' className='h-6'/>
            <text style={setClassColor('Priest')}>
              {classCounter.Priest}
            </text>
          </section>

          <section className='flex flex-row items-center'>
            <img src='/rogue.png' className='h-6'/>
            <text style={setClassColor('Rogue')}>
              {classCounter.Rogue}
            </text>
          </section>

          <section className='flex flex-row items-center'>
            <img src='/shaman.png' className='h-6'/>
            <text style={setClassColor('Shaman')}>
              {classCounter.Shaman}
            </text>
          </section>

          <section className='flex flex-row items-center'>
            <img src='/warlock.png' className='h-6'/>
            <text style={setClassColor('Warlock')}>
              {classCounter.Warlock}
            </text>
          </section>

          <section className='flex flex-row items-center'>
            <img src='/warrior.png' className='h-6'/>
            <text style={setClassColor('Warrior')}>
              {classCounter.Warrior}
            </text
            >
          </section>

        </div>

       </section>
        <div className='h-[20px] w-full fixed top-[130px] bg-[black] z-[50]'/>

        <div className={`flex flex-row fixed left-0 top-[150px] bg-[black] z-50`}>
          <text className='font-bold text-sm flex items-center justify-center w-[30px] border-0 border-r-[1px] border-[#34343430]'>Rank</text>
          <text className='font-bold flex items-center justify-center text-sm w-[140px] border-0 border-r-[1px] border-[#34343430] cursor-pointer' onClick={handleNameSort}>Character</text>
        </div>

        <div className='flex flex-row fixed top-[130px] left-[170px] z-[50]'>
          {!showRole && (<section className='text-prussian-blue-50 h-[20px] w-[60px] bg-[#20acfd62] flex items-center justify-center rounded-t-xl cursor-pointer' onClick={()=> setShowRole(!showRole)}>
            <text className='font-bold'>Hide</text>
          </section>)}

          {!showClass && (<section className='text-prussian-blue-50 h-[20px] w-[120px] bg-[#20acfd62] flex items-center justify-center rounded-t-xl cursor-pointer' onClick={()=> setShowClass(!showClass)}>
            <text className='font-bold'>Hide</text>
          </section>)}

          <div className='w-[40px]'/>

          {!showItems && (<section className='text-prussian-blue-50 h-[20px] w-[840px] bg-[#20acfd62] flex items-center justify-center rounded-t-xl cursor-pointer' onClick={()=> setShowItems(!showItems)}>
            <text className='font-bold'>Hide</text>
          </section>)}

          {!showIO && (<section className='text-prussian-blue-50 h-[20px] w-[180px] bg-[#20acfd62] flex items-center justify-center rounded-t-xl cursor-pointer' onClick={()=> setShowIO(!showIO)}>
            <text className='font-bold'>Hide</text>
          </section>)}


          {showRole &&
          <section className='text-prussian-blue-50 h-[20px] w-[50px] bg-[#20acfd62] flex items-center justify-center rounded-t-xl cursor-pointer' onClick={()=> setShowRole(!showRole)}>
            <text className='font-bold'>Role</text>
          </section>}

          {showClass &&
          <section className='text-prussian-blue-50 h-[20px] w-[50px] bg-[#20acfd62] flex items-center justify-center rounded-t-xl cursor-pointer' onClick={()=> setShowClass(!showClass)}>
            <text className='font-bold'>Class</text>
          </section>}

          {showItems &&
          <section className='text-prussian-blue-50 h-[20px] w-[50px] bg-[#20acfd62] flex items-center justify-center rounded-t-xl cursor-pointer' onClick={()=> setShowItems(!showItems)}>
            <text className='font-bold'>Gear</text>
          </section>}

          {showIO &&
          <section className='text-prussian-blue-50 h-[20px] w-[50px] bg-[#20acfd62] flex items-center justify-center rounded-t-xl cursor-pointer' onClick={()=> setShowIO(!showIO)}>
            <text className='font-bold'>IO</text>
          </section>}
        </div>


        <section className={`flex flex-row sticky bg-[black] w-full top-[150px] right-0 z-30`}>
          <div className='ml-[170px] flex flex-row z-0'>
            {!showRole && (<text className='font-bold flex items-center justify-center text-sm min-w-[60px] border-0 border-r-[1px] border-[#34343430]'>Role</text>)}
            {!showClass && (<text className='font-bold flex items-center justify-center text-sm min-w-[120px] border-0 border-r-[1px] border-[#34343430] cursor-pointer' onClick={handleClassSort}>Class</text>)}
            <text className='font-bold flex items-center justify-center text-sm min-w-[40px] border-0 border-r-[1px] border-[#34343430] cursor-pointer' onClick={handleilvlSort}>ilvl</text>
            {!showItems && (<Fade in={showItems}>
              <>
                <text className='font-bold flex items-center justify-center text-sm min-w-[40px] border-0 border-r-[1px] border-[#34343430]'>tier</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Head</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Neck</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Shldr</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Back</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Chest</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Waist</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Legs</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Feet</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Wrist</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Hands</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Ring1</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Ring2</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Trnk1</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Trnk2</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Main</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>Off</text>
              </>
            </Fade>)}
            {!showIO && (
              <>
                <text className='font-bold flex items-center justify-center text-sm min-w-[80px] border-0 border-r-[1px] border-[#34343430] cursor-pointer' onClick={handleIOSort}>IO Score</text>
                <text className='font-bold flex items-center justify-center text-sm min-w-[100px] border-0 border-r-[1px] border-[#34343430]'>Vault</text>
              </>
            )}



            {showRole && (<text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>{`<...>`}</text>)}
            {showClass && (<text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>{`<...>`}</text>)}
            {showItems && (<text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>{`<...>`}</text>)}
            {showIO && (<text className='font-bold flex items-center justify-center text-sm min-w-[50px] border-0 border-r-[1px] border-[#34343430]'>{`<...>`}</text>)}



          </div>
        </section>
        <section className={`mt-[150px] w-full`}>
          {members?.map((member: any, i: number) => (
            <div key={member.name} className={i % 2 === 0 ? 'flex flex-col bg-[#252525]' : 'flex flex-col'}>
              <main className='flex flex-row'>
                <div className={i % 2 === 0 ? 'flex flex-row bg-[#252525] sticky left-0 right-0 z-10' : 'flex flex-row bg-[black] sticky left-0 right-0 z-10'}>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[30px] border-0 border-r-[1px] border-[#34343430] text-[#732435]'>
                    {member.rank}
                    </text>
                  <text
                    className='font-bold text-sm min-w-[140px] border-0 border-r-[3px] flex items-center border-[black] pl-2'
                    style={setClassColor(member.character.key.character_class.name)}>
                    {member.character.name}
                    </text>
                </div>
                <div className='flex flex-row'>
                  {!showRole && (<text
                    className='font-bold text-sm flex items-center justify-start min-w-[60px] pl-1 border-0 border-r-[1px] border-[#34343430]'
                    style={setRoleColor(member.character.key)}>
                    {handleRole(member.character.key)}
                    </text>)}
                  {!showClass && (<text
                    className='font-bold text-sm min-w-[120px] flex items-center border-0 border-r-[1px] border-[#34343430] pl-2'
                    style={setClassColor(member.character.key.character_class.name)}>
                    {member.character.key.character_class.name}
                    </text>)}
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[40px] border-0 border-r-[1px] border-[#34343430]'
                    style={setiLevelColor(member.character.key.equipped_item_level)}>
                    {member.character.key.equipped_item_level}
                    </text>
                {!showItems && (<Fade in={showItems}>
                  <>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[40px] border-0 border-r-[1px] border-[#34343430]'
                    style={setTierColor(member.character.key.equipment.equipped_item_sets ? member.character.key.equipment.equipped_item_sets[0].display_string[member.character.key.equipment.equipped_item_sets[0].display_string.length - 4] : 0)} >
                    {member.character.key.equipment.equipped_item_sets ? member.character.key.equipment.equipped_item_sets[0].display_string[member.character.key.equipment.equipped_item_sets[0].display_string.length - 4] : 0}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Head' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Head' && each.level.value)}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Neck' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Neck' && each.level.value)}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Shoulders' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Shoulders' && each.level.value)}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Back' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Back' && each.level.value)}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Chest' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Chest' && each.level.value)}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Waist' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Waist' && each.level.value)}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Legs' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Legs' && each.level.value)}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Feet' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Feet' && each.level.value)}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Wrist' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Wrist' && each.level.value)}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Hands' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Hands' && each.level.value)}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Ring 1' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Ring 1' && each.level.value)}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Ring 2' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Ring 2' && each.level.value)}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Trinket 1' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Trinket 1' && each.level.value)}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Trinket 2' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Trinket 2' && each.level.value)}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Main Hand' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Main Hand' && each.level.value)}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={serGearColor(member.character.key.equipment.equipped_items.filter((each: any) => each.slot.name == 'Off Hand' && each.level.value))}>
                    {member.character.key.equipment.equipped_items.map((each: any) => each.slot.name == 'Off Hand' && each.level.value)}
                    </text>
                  </>
                </Fade>)}
                {!showIO && (<>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[80px] border-0 border-r-[1px] border-[#34343430]'
                    style={setiIOColor(member.character.key.mythic_keystone_profile.current_mythic_rating)}>
                    {member.character.key.mythic_keystone_profile.current_mythic_rating ? member.character.key.mythic_keystone_profile.current_mythic_rating.rating.toFixed() : ''}
                    </text>
                  <text
                    className='font-bold text-sm flex items-center justify-center min-w-[100px] border-0 border-r-[1px] border-[#34343430]'>
                    {member.character.key.mythic_keystone_profile?.current_period?.best_runs?.sort((a: any, b: any) => b.keystone_level - a.keystone_level).length < 4 && member.character.key.mythic_keystone_profile?.current_period?.best_runs?.sort((a: any, b: any) => b.keystone_level - a.keystone_level).length > 0 && member.character.key.mythic_keystone_profile?.current_period?.best_runs?.sort((a: any, b: any) => b.keystone_level - a.keystone_level)[0].keystone_level + ' | 0 | 0'}
                    {member.character.key.mythic_keystone_profile?.current_period?.best_runs?.sort((a: any, b: any) => b.keystone_level - a.keystone_level).length >= 4 && member.character.key.mythic_keystone_profile?.current_period?.best_runs?.sort((a: any, b: any) => b.keystone_level - a.keystone_level).length < 8 && member.character.key.mythic_keystone_profile?.current_period?.best_runs?.sort((a: any, b: any) => b.keystone_level - a.keystone_level)[0].keystone_level + ' | ' + member.character.key.mythic_keystone_profile?.current_period?.best_runs?.sort((a: any, b: any) => b.keystone_level - a.keystone_level)[3].keystone_level + ' | 0'}
                    {member.character.key.mythic_keystone_profile?.current_period?.best_runs?.sort((a: any, b: any) => b.keystone_level - a.keystone_level).length >= 8 && member.character.key.mythic_keystone_profile?.current_period?.best_runs?.sort((a: any, b: any) => b.keystone_level - a.keystone_level)[0].keystone_level + ' | ' + member.character.key.mythic_keystone_profile?.current_period?.best_runs?.sort((a: any, b: any) => b.keystone_level - a.keystone_level)[3].keystone_level + ' | ' + member.character.key.mythic_keystone_profile?.current_period?.best_runs?.sort((a: any, b: any) => b.keystone_level - a.keystone_level)[7].keystone_level}
                    </text>
                </>)}



                  {showRole && (<text
                    className='font-bold text-sm flex items-center justify-start min-w-[50px] pl-1 border-0 border-r-[1px] border-[#34343430]'
                    style={setRoleColor(member.character.key)}>
                    <text>...</text>
                    </text>)}
                  {showClass && (<text
                    className='font-bold text-sm min-w-[50px] flex items-center border-0 border-r-[1px] border-[#34343430] pl-2'
                    style={setClassColor(member.character.key.character_class.name)}>
                    <text>...</text>
                    </text>)}
                  {showItems && (<text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={setiLevelColor(member.character.key.equipped_item_level)}>
                    <text>...</text>
                    </text>)}
                  {showIO && (<text
                    className='font-bold text-sm flex items-center justify-center min-w-[50px] border-0 border-r-[1px] border-[#34343430]'
                    style={setiIOColor(member.character.key.mythic_keystone_profile.current_mythic_rating)}>
                    <text>...</text>
                    </text>)}

                </div>

              </main>
            </div>
          ))}
        </section>
      </div>
    </>
    : <>Blizzard is failing</>
  );
}

export const getServerSideProps = async () => {
  const data = await fetchAllData();
  return { props: { data } };
}

export default Home;
